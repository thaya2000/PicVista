provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_stateful_set" "mongo" {
  metadata {
    name = "mongo"
    namespace = "default"
  }

  spec {
    service_name = "mongo"
    replicas = 1

    selector {
      match_labels = {
        app = "mongo"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongo"
        }
      }

      spec {
        container {
          name  = "mongo"
          image = "mongo:4.2"

          port {
            container_port = 27017
          }

          volume_mount {
            name       = "mongo-storage"
            mount_path = "/data/db"
          }
        }
      }
    }

    volume_claim_template {
      metadata {
        name = "mongo-storage"
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "1Gi"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mongo" {
  metadata {
    name = "mongo"
    namespace = "default"
  }

  spec {
    port {
      port = 27017
    }

    selector = {
      app = "mongo"
    }
  }
}
