# Wasatch.Soccer Infrastructure 

The intention here is to have a backend infrastructure that will handle large scale deployments. In most cases, this may be totally unnecessary, but in the case that a website sees a lot of load it is helpful to have this all ready to go. 

The original target is Microsoft Azure. Depending on need, it is possible to do similar work for other providers. 

## Usage

### Prerequisites 
* Microsoft Azure Account
* Terraform Installed
* Azure CLI Installed

### The Two Phases

`phase one` will create a resource group and a storage account for the terraform remote state. 

`phase two` will create everything else, using the aforementioned resource group and storage account. 

The overarching idea here is that `phase one` should be run from your local machine once and then everything else can be done via the CI/CD actions without any state conflicts. 

## Resources Created
* Azure Resource Group
* Azure Storage Blob
* Azure Database for Postgresql Server
