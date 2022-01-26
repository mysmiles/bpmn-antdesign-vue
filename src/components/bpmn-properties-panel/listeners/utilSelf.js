/*
 * @Author: your name
 * @Date: 2021-11-18 13:35:33
 * @LastEditTime: 2021-11-23 18:37:23
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-process-designer-main\package\refactor\listeners\utilSelf.js
 */
// 初始化表单数据
export function initListenerForm(listener) {
  let self = {
    ...listener
  };
  if (listener.script) {
    self = {
      ...listener,
      ...listener.script,
      scriptType: listener.script.resource ? "externalScript" : "inlineScript"
    };
  }
  if (listener.event === "timeout" && listener.eventDefinitions) {
    if (listener.eventDefinitions.length) {
      let k = "";
      for (let key in listener.eventDefinitions[0]) {
        console.log(listener.eventDefinitions, key);
        if (key.indexOf("time") !== -1) {
          k = key;
          self.eventDefinitionType = key.replace("time", "").toLowerCase();
        }
      }
      console.log(k);
      self.eventTimeDefinitions = listener.eventDefinitions[0][k].body;
    }
  }
  return self;
}

export function initListenerType(listener) {
  let listenerType;
  if (listener.class) listenerType = "classListener";
  if (listener.expression) listenerType = "expressionListener";
  if (listener.delegateExpression) listenerType = "delegateExpressionListener";
  if (listener.script) listenerType = "scriptListener";
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType: listenerType
  };
}

export const listenerType = {
  classListener: "Java 类",
  expressionListener: "表达式",
  delegateExpressionListener: "代理表达式",
  scriptListener: "groovy脚本"
};

export const eventType = {
  create: "create",
  assignment: "assignment",
  complete: "complete",
  delete: "delete",
 /* update: "更新",
  timeout: "超时"*/
};

export const fieldType = {
  string: "字符串",
  expression: "表达式"
};

export const serveTaskType = {
  classListener: 'Java 类',
  expressionListener: '表达式',
  delegateExpressionListener: '代理表达式'
};

