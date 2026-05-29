from kubernetes import client, config
from datetime import datetime

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
def scale_deployment(deployment_name, namespace, replicas):
    apps_v1 = client.AppsV1Api()

    deployment = apps_v1.read_namespaced_deployment(
        name=deployment_name,
        namespace=namespace
    )

    deployment.spec.replicas = replicas

    apps_v1.patch_namespaced_deployment(
        name=deployment_name,
        namespace=namespace,
        body=deployment
    )

    return {
        "message": f"Deployment {deployment_name} scaled to {replicas} replicas"
    }

def get_pod_logs(pod_name, namespace="default"):
    logs = v1.read_namespaced_pod_log(
        name=pod_name,
        namespace=namespace
    )

    if isinstance(logs, bytes):
        logs = logs.decode("utf-8")

    return {
        "pod": pod_name,
        "namespace": namespace,
        "logs": logs
    }


def restart_deployment(deployment_name, namespace):
    apps_v1 = client.AppsV1Api()

    deployment = apps_v1.read_namespaced_deployment(
        name=deployment_name,
        namespace=namespace
    )

    deployment.spec.template.metadata.annotations = (
        deployment.spec.template.metadata.annotations or {}
    )

    deployment.spec.template.metadata.annotations[
        "kubectl.kubernetes.io/restartedAt"
    ] = datetime.utcnow().isoformat()

    apps_v1.patch_namespaced_deployment(
        name=deployment_name,
        namespace=namespace,
        body=deployment
    )

    return {
        "message": f"Deployment {deployment_name} restarted"
    }

def get_events():
    events = v1.list_event_for_all_namespaces()

    event_list = []

    for event in events.items:
        event_list.append({
            "namespace": event.metadata.namespace,
            "type": event.type,
            "reason": event.reason,
            "object": event.involved_object.name,
            "message": event.message
        })

    return event_list