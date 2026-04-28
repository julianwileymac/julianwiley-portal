"use client";

// Client-boundary re-export of @ant-design/pro-components so that server pages
// in the App Router can use these components without dragging the (server-
// hostile) module-load-time `React.createContext` calls into the server bundle.
//
// Always import Pro Components from this file inside server components.

export {
  PageContainer,
  ProCard,
  ProDescriptions,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProList,
  ProTable,
  StatisticCard,
  LoginForm,
  ProLayout,
} from "@ant-design/pro-components";

export type {
  ProColumns,
  ProColumnType,
  ProDescriptionsItemProps,
  ProFormInstance,
} from "@ant-design/pro-components";
