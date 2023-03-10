<p align="center">
<a href="https://doc2git.repography.com"><img alt="doc2git" src="./public/doc2git.png"></a>
</p>

## Create a Git repo from your Google Doc revision history

The simplest way to use doc2git is on [doc2git.repography.com](https://doc2git.repography.com).

## Running doc2git yourself

If you want to run doc2git with your own Google OAuth credentials then you can clone this repo and run it locally or deploy it elsewhere.

There's only one setting to change, which is the Google OAuth client ID. This is configured in the [Makefile](./Makefile).

To create your client ID, follow Google's instructions on [Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849?hl=en). Note that since doc2git is a client-side app using the implicit flow, you can ignore the client secret which is generated as part of this process.

## Developing doc2git

Contributions are welcome!

doc2git is a Next.js app using TypeScript. The important bits:

* [./src/pages/index.tsx](src/pages/index.tsx)
* [./src/steps/1-sign-in.tsx](./src/steps/1-sign-in.tsx)
* [./src/steps/2-generate.tsx](./src/steps/2-generate.tsx)
* [./src/steps/3-download.tsx](./src/steps/3-download.tsx)

You'll need to create a client ID as above with the your localhost / development origins.

To run locally:

```sh
nvm install        # Install/use the correct node version
npm install        # Install dependencies
make dev           # Run the dev server
```
## [![Repography logo](https://images.repography.com/logo.svg)](https://repography.com) / Recent activity [![Time period](https://images.repography.com/19895906/repography/doc2git/recent-activity/WfK3_oS4RD5UYYYFVuzSTrbsmO-SJqDods_EEfXBjRE/u9ieHpW49qXDc-06RBpRMQwG5k4yytCSG2OqR4VH8xo_badge.svg)](https://repography.com)
[![Timeline graph](https://images.repography.com/19895906/repography/doc2git/recent-activity/WfK3_oS4RD5UYYYFVuzSTrbsmO-SJqDods_EEfXBjRE/u9ieHpW49qXDc-06RBpRMQwG5k4yytCSG2OqR4VH8xo_timeline.svg)](https://github.com/repography/doc2git/commits)
[![Issue status graph](https://images.repography.com/19895906/repography/doc2git/recent-activity/WfK3_oS4RD5UYYYFVuzSTrbsmO-SJqDods_EEfXBjRE/u9ieHpW49qXDc-06RBpRMQwG5k4yytCSG2OqR4VH8xo_issues.svg)](https://github.com/repography/doc2git/issues)

## [![Repography logo](https://images.repography.com/logo.svg)](https://repography.com) / Structure
[![Structure](https://images.repography.com/19895906/repography/doc2git/structure/WfK3_oS4RD5UYYYFVuzSTrbsmO-SJqDods_EEfXBjRE/25SCXE_S_nKk0g1KyIkozybw-lMuQc_DYgtMNfDveYc_table.svg)](https://github.com/repography/doc2git)
