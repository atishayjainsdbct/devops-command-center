from kubernetes import client, config
from kubernetes.config.config_exception import ConfigException
from datetime import datetime
import subprocess
from kubernetes.client.rest import ApiException

v1 = None

try:
    config.load_incluster_config()
    print("Running inside Kubernetes")
    v1 = client.CoreV1Api()

except ConfigException:
    try:
        config.load_kube_config()
        print("Running locally")
        v1 = client.CoreV1Api()

    except ConfigException:
        print("No Kubernetes configuration found")


def cluster_available():
    return v1 is not None


def get_pods(namespace=None):

    if not cluster_available():
        return [{
            "name": "No Cluster Connected",
            "namespace": "-",
            "status": "Disconnected"
        }]

    if namespace:
        pods = v1.list_namespaced_pod(namespace=namespace)
    else:
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

    if not cluster_available():
        return ["No Cluster Connected"]

    namespaces = v1.list_namespace()

    namespace_list = []

    for ns in namespaces.items:
        namespace_list.append(ns.metadata.name)

    return namespace_list


def get_deployments():

    if not cluster_available():
        return []

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

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

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

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

    try:
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

    except ApiException as e:
        return {
            "error": str(e)
        }


def get_deployment_details(deployment_name, namespace="default"):

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

    apps_v1 = client.AppsV1Api()

    deployment = apps_v1.read_namespaced_deployment(
        name=deployment_name,
        namespace=namespace
    )

    return {
        "name": deployment.metadata.name,
        "namespace": deployment.metadata.namespace,
        "replicas": deployment.spec.replicas,
        "available_replicas": deployment.status.available_replicas,
        "strategy": deployment.spec.strategy.type,
        "creation_time": deployment.metadata.creation_timestamp
    }


def restart_deployment(deployment_name, namespace):

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

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

    if not cluster_available():
        return []

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


def delete_pod(pod_name, namespace="default"):

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

    v1.delete_namespaced_pod(
        name=pod_name,
        namespace=namespace
    )

    return {
        "message": f"Pod {pod_name} deleted successfully"
    }


def get_rollout_status(deployment_name, namespace="default"):

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

    apps_v1 = client.AppsV1Api()

    deployment = apps_v1.read_namespaced_deployment(
        name=deployment_name,
        namespace=namespace
    )

    desired = deployment.spec.replicas
    ready = deployment.status.ready_replicas or 0
    available = deployment.status.available_replicas or 0

    if ready == desired and available == desired:
        status = "Healthy"
    else:
        status = "Progressing"

    return {
        "deployment": deployment_name,
        "desired_replicas": desired,
        "ready_replicas": ready,
        "available_replicas": available,
        "status": status
    }


def get_deployment_history(deployment_name, namespace="default"):

    if not cluster_available():
        return []

    apps_v1 = client.AppsV1Api()

    replica_sets = apps_v1.list_namespaced_replica_set(
        namespace=namespace
    )

    history = []

    for rs in replica_sets.items:

        if rs.metadata.name.startswith(deployment_name):

            revision = rs.metadata.annotations.get(
                "deployment.kubernetes.io/revision",
                "unknown"
            )

            history.append({
                "replicaset": rs.metadata.name,
                "revision": revision
            })

    history.sort(
        key=lambda x: int(x["revision"])
    )

    return history


def rollback_deployment(deployment_name, namespace="default"):

    if not cluster_available():
        return {
            "error": "No Kubernetes cluster connected"
        }

    result = subprocess.run(
        [
            "kubectl",
            "rollout",
            "undo",
            f"deployment/{deployment_name}",
            "-n",
            namespace
        ],
        capture_output=True,
        text=True
    )

    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "returncode": result.returncode
    }


def get_cluster_health():

    if not cluster_available():
        return {
            "api_status": "healthy",
            "cluster_connected": False,
            "total_nodes": 0,
            "ready_nodes": 0,
            "failed_pods": 0
        }

    nodes = v1.list_node()

    total_nodes = len(nodes.items)
    ready_nodes = 0

    for node in nodes.items:

        for condition in node.status.conditions:

            if (
                condition.type == "Ready"
                and condition.status == "True"
            ):
                ready_nodes += 1

    pods = v1.list_pod_for_all_namespaces()

    failed_pods = 0

    for pod in pods.items:

        if pod.status.phase in [
            "Failed",
            "Unknown"
        ]:
            failed_pods += 1

    return {
        "api_status": "healthy",
        "cluster_connected": True,
        "total_nodes": total_nodes,
        "ready_nodes": ready_nodes,
        "failed_pods": failed_pods
    }