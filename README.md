

# Creating a Fiori APP for Cloud Foundry with BTP Destination

This Fiori App was created to communicate with a PG_SYSTEM destination created on BTP.

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org


### Creating the Project:

- Open Business Application Studio
- Go to Get Started Helper
- Click on New Project from Template
- Select SAP Fiori Application
- Click on the Basic app card
- Fill the Data Source parameters:
    
    Data Source: None
    
- Fill the Entity Selection:
    
    View Name: Main
    
- Project Attributes:
    
    Module Name(Project Name): sapui5-btp-cf
    
    Namespace: optional
    
- Select the “Add deployment configuration” option and press Next
- Chose the deployment configuration as Cloud Foundry and keep the destination as None
- Make sure the managed application router option is set to Yes and click on Finish

### Configuring the Destination:

Check if the destination can be accessed by the BAS Terminal:

```json
curl -v -i "PG_SYSTEM.dest/odata/v4/my/Books"
```

Create the destination pointing to the target Backend.

```
Type=HTTP
Authentication=OAuth2ClientCredentials
Name=PG_SYSTEM
tokenServiceURL=<uaa_url>/oauth/token
ProxyType=Internet
URL=<odata_base_url>
tokenServiceURLType=Dedicated
clientId=<uaa_client_id>
clientSecret=<uaa_client_secret>

sap-platform=CF
WebIDEEnabled=true
HTML5.DynamicDestination=true
TrustAll=true
WebIDEUsage=odata_gen,odata_abap,dev_abap,ui5_execute_abap
```

Change the xs-app.json to have the mapping to the the target destination.

Add it to the first position of the routes array:

```
{
  "source": "^/pgsystem/(.*)$",
  "target": "$1",
  "authenticationType": "none",
  "csrfProtection": false,
  "destination": "PG_SYSTEM"
}
```

Change the manifest.json to have the datasource and model to access the destination endpoint.

DataSource:

```json
"sap.app": {
    ...
    "sourceTemplate": {
        "id": "@sap/generator-fiori:basic",
        "version": "1.11.5",
        "toolsId": "f1c897d8-bb32-4115-9ac4-066df7774d6c"
    },
    "dataSources": {
        "mainService": {
            "uri": "pgsystem/odata/v4/my/",
            "type": "OData",
            "settings": {
                "annotations": [],
                "localUri": "localService/metadata.xml",
                "odataVersion": "4.0"
            }
        }
    }
}
```

Model:

```json
"models": {
    "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
            "bundleName": "gstanley.sapui5btpcf.i18n.i18n"
        }
    },
    "MainModel": {
        "dataSource": "mainService",
        "preload": true,
        "settings": {
            "synchronizationMode": "None",
            "operationMode": "Server",
            "autoExpandSelect": true,
            "earlyRequests": true
        }
    }
}
```

### Creating configuration for Local Development:

At this point if we deploy the app we will already have access to the destination endpoint, but if we try to execute it locally using BAS it will not work. To do that we need to change the following files:

Reference: [https://www.npmjs.com/package/@sap/ux-ui5-tooling](https://www.npmjs.com/package/@sap/ux-ui5-tooling)

**ui5.yaml**
Add the backend property below ui5

```yaml
specVersion: "3.1"
metadata:
  name: gstanley.sapui5btpcf
type: application
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ignoreCertError: false # If set to true, certificate errors will be ignored. E.g. self-signed certificates will be accepted
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://ui5.sap.com
        backend:
          - path: /pgsystem/odata/v4/my
            pathPrefix: /odata/v4/my
            destination: PG_SYSTEM
    - name: fiori-tools-appreload
      afterMiddleware: compression
      configuration:
        port: 35729
        path: webapp
        delay: 300
    - name: fiori-tools-preview
      afterMiddleware: fiori-tools-appreload
      configuration:
        component: gstanley.sapui5btpcf
        ui5Theme: sap_horizon
```

 **ui5-local.yaml**
 Add the backend tag below ignoreCertError

```yaml
# yaml-language-server: $schema=https://sap.github.io/ui5-tooling/schema/ui5.yaml.json

specVersion: "3.1"
metadata:
  name: gstanley.sapui5btpcf
type: application
framework:
  name: SAPUI5
  version: 1.120.1
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.f
    - name: sap.suite.ui.generic.template
    - name: sap.ui.comp
    - name: sap.ui.generic.app
    - name: sap.ui.table
    - name: sap.ushell
    - name: themelib_sap_horizon
server:
  customMiddleware:
    - name: fiori-tools-appreload
      afterMiddleware: compression
      configuration:
        port: 35729
        path: webapp
        delay: 300
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ignoreCertError: false
        backend:
          - path: /pgsystem/odata/v4/my
            pathPrefix: /odata/v4/my
            destination: PG_SYSTEM
    - name: fiori-tools-preview
      afterMiddleware: fiori-tools-appreload
      configuration:
        component: gstanley.sapui5btpcf
        ui5Theme: sap_horizon
```

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

### Deploying the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    cf login
    npm install
    npm run build
    npm run build:mta
    npm run deploy
```

## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Thu Dec 07 2023 15:49:12 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.11.5|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>simple|
|**Service Type**<br>None|
|**Service URL**<br>N/A
|**Module Name**<br>sapui5-btp-cf|
|**Application Title**<br>SAPUI5 BTP Fiori on CF|
|**Namespace**<br>|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.120.1|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|

