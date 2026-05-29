from kubernetes import client, config

config.load_kube_config()

v1 = client.CoreV1Api()

def get_pods():
    pods = v1.list_pod_for_all_namespaces(watch=False)

    pod_list = []

    for pod in pods.items:
        pod_list.append({
            "name": pod.metadata.name,
            "namespace": pod.metadata.namespace,
            "status": pod.status.phase
        })

    return pod_list


def get_namespaces():
    namespaces = v1.list_namespace()

    namespace_list = []

    for ns in namespaces.items:
        namespace_list.append(ns.metadata.name)

    return namespace_list

def get_deployments():
    apps_v1 = client.AppsV1Api()

    deployments = apps_v1.list_deployment_for_all_namespaces()

    deployment_list = []

    for deployment in deployments.items:
        deployment_list.append({
            "name": deployment.metadata.name,
            "namespace": deployment.metadata.namespace,
            "replicas": deployment.spec.replicas,
            "available_replicas": deployment.status.available_replicas
        })

    return deployment_list