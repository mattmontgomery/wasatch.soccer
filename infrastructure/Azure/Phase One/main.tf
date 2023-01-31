terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  # Configuration options
}

provider "random" {
}

resource "random_string" "random_four" {
  length  = 4
  lower   = true
  numeric = true
  special = false
  upper   = false
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.resource_location
}

resource "azurerm_storage_account" "st_terraform_states_westus" {
  name                     = "stterraformstates${random_string.random_four.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "st_container_terraform_states_westus" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.st_terraform_states_westus.name
  container_access_type = "blob"
}
