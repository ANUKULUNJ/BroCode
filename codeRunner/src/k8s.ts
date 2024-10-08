import {
  KubeConfig,
  CoreV1Api,
  V1ConfigMap,
  V1Pod,
} from "@kubernetes/client-node";

const namespace = "default";
const pollingInterval = 500;
const maxIntervalCount = 5;

const kc = new KubeConfig();
kc.loadFromCluster();

const coreApi = kc.makeApiClient(CoreV1Api);

const generateRandomName = (type: string): string => {
  const baseName = `python-execution-${type}`;
  const randomSuffix = Math.random().toString(36).substring(7);
  const timestamp = new Date().getTime();
  return `${baseName}-${timestamp}-${randomSuffix}`;
};

const getConfigMapManifest = (mapName: string, code: string): V1ConfigMap => {
  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: mapName,
    },
    data: {
      "script.py": code,
    },
  };
};

const getPodManifest = (
  podName: string,
  mapName: string,
  input: string
): V1Pod => {
  const command = `echo "${input}" | python /mnt/script.py`;

  return {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: podName,
    },
    spec: {
      containers: [
        {
          name: "python-container",
          image: "python:3",
          command: ["sh", "-c", command],
          volumeMounts: [
            {
              name: "config-volume",
              mountPath: "/mnt",
            },
          ],
        },
      ],
      volumes: [
        {
          name: "config-volume",
          configMap: {
            name: mapName,
          },
        },
      ],
      restartPolicy: "Never",
    },
  };
};

const checkPodContainerTermination = async (
  podName: string
): Promise<boolean> => {
  try {
    const pod = await coreApi.readNamespacedPodStatus(podName, namespace);
    return pod?.body?.status?.containerStatuses
      ? !!pod.body.status.containerStatuses[0].state?.terminated
      : false;
  } catch (error) {
    console.error("Error checking pod status:", error);
    return false;
  }
};

const handleExecution = (podName: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      let intervalCount = 0;
      for (; intervalCount < maxIntervalCount; intervalCount++) {
        const isTerminated = await checkPodContainerTermination(podName);
        if (isTerminated) {
          const logsResponse = await coreApi.readNamespacedPodLog(
            podName,
            namespace
          );
          resolve(
            logsResponse.body !== undefined
              ? typeof logsResponse.body === "string"
                ? logsResponse.body
                : JSON.stringify(logsResponse.body)
              : ""
          );
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }

      resolve("Time Limit Reached.");
    } catch (err) {
      reject("Error Handling Execution: " + err);
    }
  });
};

const executePythonCode = (code: string, input: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const mapName = generateRandomName("map");
      const mapRes = await coreApi.createNamespacedConfigMap(
        namespace,
        getConfigMapManifest(mapName, code)
      );
      console.log("configMap created: ", mapRes.body.metadata?.name);

      const podName = generateRandomName("pod");
      const podResponse =
        mapRes &&
        (await coreApi.createNamespacedPod(
          namespace,
          getPodManifest(podName, mapName, input)
        ));
      console.log("Pod created:", podResponse.body.metadata?.name);

      const logs = await handleExecution(podName);
      if (logs) {
        await coreApi.deleteNamespacedConfigMap(mapName, namespace);
        await coreApi.deleteNamespacedPod(podName, namespace);
      }
      resolve(logs);
    } catch (error) {
      console.error("Error creating Job:", error instanceof Error ? error.message : String(error));
      reject(error);
    }
  });
};

export { executePythonCode };
