import React, { Component } from 'react';
import Extension from '../../Extension';
import { App, Statusbar, View, Page, Navbar, Toolbar, Link, f7 } from 'framework7-react';
import Navigator from '../navigator/navigator.jsx';

//TODO: re-implement 'Please update your Browser'

const extension = new Extension();
const getExtensionHandler = () => (extension.extensionHandler)
const state = {
  requireUpdate: extension.requireUpdate
}
const f7params = {
  name: 'My App',
  routes: [
    {
      path: '/',
      component: Navigator,
      options: {
        props: {
          getExtensionHandler: getExtensionHandler
        },
      },
    },
  ]
}

export default () => (
  <App { ...f7params}>
    <View main url='/' />
  </App>
)