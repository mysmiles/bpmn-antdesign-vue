/*
 * @Author: your name
 * @Date: 2021-11-18 13:35:33
 * @LastEditTime: 2021-11-25 12:34:14
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-process-designer-main\package\utils.js
 */
// 创建监听器实例
export function createListenerObject(options, isTask, prefix) {
  const listenerObj = Object.create(null);
  listenerObj.event = options.event;
  isTask && (listenerObj.id = options.id); // 任务监听器特有的 id 字段
  switch (options.listenerType) {
    case "scriptListener":
      // listenerObj.script = createScriptObject(element, options, prefix);
      listenerObj.expression = '${groovyHandler.groovyHandler(task, "' + options.groovyKeyId + '")}';
      break;
    case "expressionListener":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpressionListener":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;
  }
  // 注入字段
  if (options.fields) {
    listenerObj.fields = options.fields.map(field => {
      return createFieldObject(field, prefix);
    });
  }
  // 任务监听器的 定时器 设置
  if (isTask && options.event === "timeout" && !!options.eventDefinitionType) {
    const timeDefinition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: options.eventTimeDefinitions });
    const TimerEventDefinition = window.bpmnInstances.moddle.create("bpmn:TimerEventDefinition", {
      id: `TimerEventDefinition_${uuid(8)}`,
      [`time${options.eventDefinitionType.replace(/^\S/, s => s.toUpperCase())}`]: timeDefinition
    });
    listenerObj.eventDefinitions = [TimerEventDefinition];
  }
  return window.bpmnInstances.moddle.create(`${prefix}:${isTask ? "TaskListener" : "ExecutionListener"}`, listenerObj);
}

// 创建 监听器的注入字段 实例
export function createFieldObject(option, prefix) {
  const { name, fieldType, string, expression } = option;
  const fieldConfig = fieldType === "string" ? { name, string } : { name, expression };
  return window.bpmnInstances.moddle.create(`${prefix}:Field`, fieldConfig);
}

/*// 创建脚本实例
export function createScriptObject(element, options) {
  const { groovyKeyId} = options;
  console.log("element", element)
  console.log("options", options)
  // const scriptConfig = { groovyKeyId};
  // return window.bpmnInstances.moddle.create(`${prefix}:Script`, scriptConfig);
  return window.bpmnInstances.modeling.updateProperties(element, {
    expression: '${groovyHandler.groovyHandler(task, "' + groovyKeyId + '")}'
  });
}*/

// 更新元素扩展属性
export function updateElementExtensions(element, extensionList) {
  const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
    values: extensionList
  });
  window.bpmnInstances.modeling.updateProperties(element, {
    extensionElements: extensions
  });
}

// 创建一个id
export function uuid(length = 8, chars) {
  let result = "";
  let charsString = chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
}
