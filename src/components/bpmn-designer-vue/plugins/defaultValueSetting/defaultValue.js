export function defaultValue(element, prefix) {
  console.log({ element })
  switch (element.type) {
    case "bpmn:UserTask":
     setUserTaskDefaultValue(element, prefix)
     break;
    case "bpmn:CallActivity":
      setCallActivityDefaultValue(element, prefix)
      break;
    /*case "expressionListener":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpressionListener":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;*/
  }
}

function setUserTaskDefaultValue(element) {
  const defaultValue = Object.create(null)
  for (let item in userTaskDefaultValue) {
    defaultValue[item] = userTaskDefaultValue[item]
  }
  return window.bpmnInstances.modeling.updateProperties(element, defaultValue);
}

function setCallActivityDefaultValue(element) {
  const defaultValue = Object.create(null)
  for (let item in callActivityDefaultValue) {
    defaultValue[item] = callActivityDefaultValue[item]
  }
  return window.bpmnInstances.modeling.updateProperties(element, defaultValue);
}

const userTaskDefaultValue = {
  isCandidate: "0",
  isMultiInstance: "0",
  enablePrint: "0",
  enableEntrusted: "0",
  arriveNotification: "0",
  assigneeShowType: "1",
  assigneeHistoryFirst: "0",
  taskAutoSubmit: "0",
  maxAssigneeNum: "1",
  minAssigneeNum: "1",
  enableTrack: "0",
  requireComment: "0",
  assigneeRouter: "1"
}

const callActivityDefaultValue = {}

export function changeMultiInstance(element) {
  const isMultiInstance = !!element?.businessObject.loopCharacteristics;
  if (isMultiInstance) {
    // 更新节点上的isMultiInstance
    return window.bpmnInstances.modeling.updateProperties(element, { isMultiInstance: "1" });
    //
  }
}