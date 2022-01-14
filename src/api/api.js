import axios from 'axios';
import qs from 'qs';
let domain = '';
export const getDomain = () => {
  return domain;
};
export const setDomain = $domain => {
  domain = $domain;
};
export const request = (method, url, body, queryParameters, form, config) => {
  method = method.toLowerCase();
  const keys = Object.keys(queryParameters);
  config = Object.assign(
    {
      arrayFormat: 'repeat'
    },
    config
  );
  let queryUrl = url;
  if (keys.length > 0) {
    queryUrl = url + '?' + qs.stringify(queryParameters, config);
  }
  // let queryUrl = url+(keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '')
  if (body) {
    return axios[method](queryUrl, body, config);
  } else if (method === 'get') {
    return axios[method](
      queryUrl,
      {
        params: form
      },
      config
    );
  } else {
    return axios[method](queryUrl, qs.stringify(form), config);
  }
};
/**
 * 排序属性：createTime
 成功：code=200，data对象为包含分页信息的表单列表，失败：code!=200
 * request: listFormDefinition
 * url: listFormDefinitionURL
 * method: listFormDefinition_TYPE
 * raw_url: listFormDefinition_RAW_URL
 * @param pageNumber - 分页号码,从0开始
 * @param pageSize - 分页大小
 * @param searchCreateDateBegin - 查询条件:创建日期起，格式yyyy-mm-dd
 * @param searchCreateDateEnd - 查询条件:创建日期止，格式yyyy-mm-dd
 * @param searchCreateUserId - 查询条件:创建人Id，精确查询
 * @param searchName - 查询条件:表单名称，模糊查询
 * @param searchType - 查询条件:表单类别，精确查询
 * @param sort - 排序规则，格式: 字段名[,asc|desc]，默认升序，支持多字段排序
 */
export const listFormDefinition = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/formDefinitions'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['pageNumber'] !== undefined) {
    queryParameters['pageNumber'] = parameters['pageNumber']
  }
  if (parameters['pageSize'] !== undefined) {
    queryParameters['pageSize'] = parameters['pageSize']
  }
  if (parameters['searchCreateDateBegin'] !== undefined) {
    queryParameters['search_createDateBegin'] = parameters['searchCreateDateBegin']
  }
  if (parameters['searchCreateDateEnd'] !== undefined) {
    queryParameters['search_createDateEnd'] = parameters['searchCreateDateEnd']
  }
  if (parameters['searchCreateUserId'] !== undefined) {
    queryParameters['search_createUserId'] = parameters['searchCreateUserId']
  }
  if (parameters['searchName'] !== undefined) {
    queryParameters['search_name'] = parameters['searchName']
  }
  if (parameters['searchType'] !== undefined) {
    queryParameters['search_type'] = parameters['searchType']
  }
  if (parameters['sort'] !== undefined) {
    queryParameters['sort'] = parameters['sort']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 排序字段：code,name,description,type,sortIndex,isSystem,isEnable,createTime
 成功：code=200，data对象为包含分页信息的字典列表，失败：code!=200
 * request: listDictionaries
 * url: listDictionariesURL
 * method: listDictionaries_TYPE
 * raw_url: listDictionaries_RAW_URL
 * @param pageNumber - 分页号码,从0开始
 * @param pageSize - 分页大小
 * @param searchCode - 查询条件:字典代码，模糊匹配
 * @param searchCreateDateBegin - 查询条件:创建日期起，格式yyyy-mm-dd
 * @param searchCreateDateEnd - 查询条件:创建日期止，格式yyyy-mm-dd
 * @param searchDescription - 查询条件:字典描述，模糊匹配
 * @param searchIsEnable - 查询条件:是否可用，，1：是，0：否，精确匹配
 * @param searchIsSystem - 查询条件:是否是系统预置，，1：是，0：否，精确匹配
 * @param searchName - 查询条件:字典名称，模糊匹配
 * @param searchType - 查询条件:字典类型，精确匹配
 * @param sort - 排序规则，格式: 字段名[,asc|desc]，默认升序，支持多字段排序
 */
export const listDictionaries = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/dictionaries'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['pageNumber'] !== undefined) {
    queryParameters['pageNumber'] = parameters['pageNumber']
  }
  if (parameters['pageSize'] !== undefined) {
    queryParameters['pageSize'] = parameters['pageSize']
  }
  if (parameters['searchCode'] !== undefined) {
    queryParameters['search_code'] = parameters['searchCode']
  }
  if (parameters['searchCreateDateBegin'] !== undefined) {
    queryParameters['search_createDateBegin'] = parameters['searchCreateDateBegin']
  }
  if (parameters['searchCreateDateEnd'] !== undefined) {
    queryParameters['search_createDateEnd'] = parameters['searchCreateDateEnd']
  }
  if (parameters['searchDescription'] !== undefined) {
    queryParameters['search_description'] = parameters['searchDescription']
  }
  if (parameters['searchIsEnable'] !== undefined) {
    queryParameters['search_isEnable'] = parameters['searchIsEnable']
  }
  if (parameters['searchIsSystem'] !== undefined) {
    queryParameters['search_isSystem'] = parameters['searchIsSystem']
  }
  if (parameters['searchName'] !== undefined) {
    queryParameters['search_name'] = parameters['searchName']
  }
  if (parameters['searchType'] !== undefined) {
    queryParameters['search_type'] = parameters['searchType']
  }
  if (parameters['sort'] !== undefined) {
    queryParameters['sort'] = parameters['sort']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 成功：code=200，data对象为表单信息，失败：code!=200
 * request: loadFormDefinitionById
 * url: loadFormDefinitionByIdURL
 * method: loadFormDefinitionById_TYPE
 * raw_url: loadFormDefinitionById_RAW_URL
 * @param id - 表单ID
 */
export const loadFormDefinitionById = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/formDefinitions/{id}'
  let body
  let queryParameters = {}
  let form = {}
  path = path.replace('{id}', `${parameters['id']}`)
  if (parameters['id'] === undefined) {
    return Promise.reject(new Error('Missing required  parameter: id'))
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 成功：code=200，data对象为包含枚举信息的列表，失败：code!=200
 * request: listEnumsByType
 * url: listEnumsByTypeURL
 * method: listEnumsByType_TYPE
 * raw_url: listEnumsByType_RAW_URL
 * @param types - 枚举类型代码，逗号分隔
 */
export const listEnumsByType = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/enums/types/{types}'
  let body
  let queryParameters = {}
  let form = {}
  path = path.replace('{types}', `${parameters['types']}`)
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 排序属性：createTime
 成功：code=200，data对象为组织机构部门用户列表，失败：code!=200
 * request: listOrgDeptUsers
 * url: listOrgDeptUsersURL
 * method: listOrgDeptUsers_TYPE
 * raw_url: listOrgDeptUsers_RAW_URL
 * @param searchIsEnable - 查询条件:是否启用，0：否，1：是，精确匹配
 * @param searchName - 查询条件:名称，模糊查询
 * @param searchParentId - 查询条件:父节点ID，精确查询
 */
export const listOrgDeptUsers = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/users/orgDeptUserList'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['searchIsEnable'] !== undefined) {
    queryParameters['search_isEnable'] = parameters['searchIsEnable']
  }
  if (parameters['searchName'] !== undefined) {
    queryParameters['search_name'] = parameters['searchName']
  }
  if (parameters['searchParentId'] !== undefined) {
    queryParameters['search_parentId'] = parameters['searchParentId']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 成功：code=0，data对象为结果数据，失败：code!=0
 * request: loadUserById
 * url: loadUserByIdURL
 * method: loadUserById_TYPE
 * raw_url: loadUserById_RAW_URL
 * @param id - 用户ID
 */
export const loadUserById = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/users/{id}'
  let body
  let queryParameters = {}
  let form = {}
  path = path.replace('{id}', `${parameters['id']}`)
  if (parameters['id'] === undefined) {
    return Promise.reject(new Error('Missing required  parameter: id'))
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 排序属性：code,name,description,level.code,level.name,isSystem,isEnable,createTime
 成功：code=200，data对象为包含分页信息的角色列表，失败：code!=200
 * request: listRoles
 * url: listRolesURL
 * method: listRoles_TYPE
 * raw_url: listRoles_RAW_URL
 * @param pageNumber - 分页号码,从0开始
 * @param pageSize - 分页大小
 * @param searchCode - 查询条件:角色代码，模糊匹配
 * @param searchCreateDateBegin - 查询条件:创建日期起，格式yyyy-mm-dd
 * @param searchCreateDateEnd - 查询条件:创建日期止，格式yyyy-mm-dd
 * @param searchDescription - 查询条件:角色描述，模糊匹配
 * @param searchIsEnable - 查询条件:是否可用，，1：是，0：否，精确匹配
 * @param searchIsSystem - 查询条件:是否系统角色，1：是，0：否，精确匹配
 * @param searchLevel - 查询条件:角色级别，对应角色字典，精确匹配
 * @param searchLevelName - 查询条件:角色级别名称，模糊匹配
 * @param searchName - 查询条件:角色名称，模糊匹配
 * @param sort - 排序规则，格式: 字段名[,asc|desc]，默认升序，支持多字段排序
 */
export const listRoles = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/roles'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['pageNumber'] !== undefined) {
    queryParameters['pageNumber'] = parameters['pageNumber']
  }
  if (parameters['pageSize'] !== undefined) {
    queryParameters['pageSize'] = parameters['pageSize']
  }
  if (parameters['searchCode'] !== undefined) {
    queryParameters['search_code'] = parameters['searchCode']
  }
  if (parameters['searchCreateDateBegin'] !== undefined) {
    queryParameters['search_createDateBegin'] = parameters['searchCreateDateBegin']
  }
  if (parameters['searchCreateDateEnd'] !== undefined) {
    queryParameters['search_createDateEnd'] = parameters['searchCreateDateEnd']
  }
  if (parameters['searchDescription'] !== undefined) {
    queryParameters['search_description'] = parameters['searchDescription']
  }
  if (parameters['searchIsEnable'] !== undefined) {
    queryParameters['search_isEnable'] = parameters['searchIsEnable']
  }
  if (parameters['searchIsSystem'] !== undefined) {
    queryParameters['search_isSystem'] = parameters['searchIsSystem']
  }
  if (parameters['searchLevel'] !== undefined) {
    queryParameters['search_level'] = parameters['searchLevel']
  }
  if (parameters['searchLevelName'] !== undefined) {
    queryParameters['search_levelName'] = parameters['searchLevelName']
  }
  if (parameters['searchName'] !== undefined) {
    queryParameters['search_name'] = parameters['searchName']
  }
  if (parameters['sort'] !== undefined) {
    queryParameters['sort'] = parameters['sort']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 排序字段：code,name,description,parent.id,parent.name,sortIndex,isEnable,createTime
 成功：code=200，data对象为包含分页信息的组织机构列表，失败：code!=200
 * request: listOrganizations
 * url: listOrganizationsURL
 * method: listOrganizations_TYPE
 * raw_url: listOrganizations_RAW_URL
 * @param pageNumber - 分页号码,从0开始
 * @param pageSize - 分页大小
 * @param searchCode - 查询条件:组织机构代码，模糊匹配
 * @param searchCreateDateBegin - 查询条件:创建日期起，格式yyyy-mm-dd
 * @param searchCreateDateEnd - 查询条件:创建日期止，格式yyyy-mm-dd
 * @param searchDescription - 查询条件:组织机构描述，模糊匹配
 * @param searchIsEnable - 查询条件:是否可用，，1：是，0：否，精确匹配
 * @param searchName - 查询条件:组织机构名称，模糊匹配
 * @param searchParentId - 查询条件:级组织机构ID，精确匹配
 * @param searchParentName - 查询条件:上级组织机构名称，模糊匹配
 * @param sort - 排序规则，格式: 字段名[,asc|desc]，默认升序，支持多字段排序
 */
export const listOrganizations = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/organizations'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['pageNumber'] !== undefined) {
    queryParameters['pageNumber'] = parameters['pageNumber']
  }
  if (parameters['pageSize'] !== undefined) {
    queryParameters['pageSize'] = parameters['pageSize']
  }
  if (parameters['searchCode'] !== undefined) {
    queryParameters['search_code'] = parameters['searchCode']
  }
  if (parameters['searchCreateDateBegin'] !== undefined) {
    queryParameters['search_createDateBegin'] = parameters['searchCreateDateBegin']
  }
  if (parameters['searchCreateDateEnd'] !== undefined) {
    queryParameters['search_createDateEnd'] = parameters['searchCreateDateEnd']
  }
  if (parameters['searchDescription'] !== undefined) {
    queryParameters['search_description'] = parameters['searchDescription']
  }
  if (parameters['searchIsEnable'] !== undefined) {
    queryParameters['search_isEnable'] = parameters['searchIsEnable']
  }
  if (parameters['searchName'] !== undefined) {
    queryParameters['search_name'] = parameters['searchName']
  }
  if (parameters['searchParentId'] !== undefined) {
    queryParameters['search_parentId'] = parameters['searchParentId']
  }
  if (parameters['searchParentName'] !== undefined) {
    queryParameters['search_parentName'] = parameters['searchParentName']
  }
  if (parameters['sort'] !== undefined) {
    queryParameters['sort'] = parameters['sort']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 排序字段：code,name,description,parent.id,parent.name,organization.id,
 organization.name,sortIndex,isEnable,createTime,
 成功：code=200，data对象为包含分页信息的部门列表，失败：code!=200
 * request: listDepartments
 * url: listDepartmentsURL
 * method: listDepartments_TYPE
 * raw_url: listDepartments_RAW_URL
 * @param pageNumber - 分页号码,从0开始
 * @param pageSize - 分页大小
 * @param searchCode - 查询条件:部门代码，模糊匹配
 * @param searchCreateDateBegin - 查询条件:创建日期起，格式yyyy-mm-dd
 * @param searchCreateDateEnd - 查询条件:创建日期止，格式yyyy-mm-dd
 * @param searchDescription - 查询条件:部门描述，模糊匹配
 * @param searchIsEnable - 查询条件:是否可用，，1：是，0：否，精确匹配
 * @param searchName - 查询条件:部门名称，模糊匹配
 * @param searchOrganizationId - 查询条件:所属组织机构ID，精确匹配
 * @param searchOrganizationName - 查询条件:所属组织机构名称，模糊匹配
 * @param searchParentId - 查询条件:上级部门ID，精确匹配
 * @param searchParentName - 查询条件:上级部门名称，模糊匹配
 * @param sort - 排序规则，格式: 字段名[,asc|desc]，默认升序，支持多字段排序
 */
export const listDepartments = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/departments'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['pageNumber'] !== undefined) {
    queryParameters['pageNumber'] = parameters['pageNumber']
  }
  if (parameters['pageSize'] !== undefined) {
    queryParameters['pageSize'] = parameters['pageSize']
  }
  if (parameters['searchCode'] !== undefined) {
    queryParameters['search_code'] = parameters['searchCode']
  }
  if (parameters['searchCreateDateBegin'] !== undefined) {
    queryParameters['search_createDateBegin'] = parameters['searchCreateDateBegin']
  }
  if (parameters['searchCreateDateEnd'] !== undefined) {
    queryParameters['search_createDateEnd'] = parameters['searchCreateDateEnd']
  }
  if (parameters['searchDescription'] !== undefined) {
    queryParameters['search_description'] = parameters['searchDescription']
  }
  if (parameters['searchIsEnable'] !== undefined) {
    queryParameters['search_isEnable'] = parameters['searchIsEnable']
  }
  if (parameters['searchName'] !== undefined) {
    queryParameters['search_name'] = parameters['searchName']
  }
  if (parameters['searchOrganizationId'] !== undefined) {
    queryParameters['search_organizationId'] = parameters['searchOrganizationId']
  }
  if (parameters['searchOrganizationName'] !== undefined) {
    queryParameters['search_organizationName'] = parameters['searchOrganizationName']
  }
  if (parameters['searchParentId'] !== undefined) {
    queryParameters['search_parentId'] = parameters['searchParentId']
  }
  if (parameters['searchParentName'] !== undefined) {
    queryParameters['search_parentName'] = parameters['searchParentName']
  }
  if (parameters['sort'] !== undefined) {
    queryParameters['sort'] = parameters['sort']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 成功：code=200，data对象为任务节点拓展信息，失败：code!=200
 * request: listTaskDefExtendById
 * url: listTaskDefExtendByIdURL
 * method: listTaskDefExtendById_TYPE
 * raw_url: listTaskDefExtendById_RAW_URL
 * @param procDefId - 流程定义ID
 */
export const listTaskDefExtendById = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/taskDefExtends/{procDefId}/search'
  let body
  let queryParameters = {}
  let form = {}
  path = path.replace('{procDefId}', `${parameters['procDefId']}`)
  if (parameters['procDefId'] === undefined) {
    return Promise.reject(new Error('Missing required  parameter: procDefId'))
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}
/**
 * 排序属性：
 成功：code=200，data对象为包含分页信息的列表，失败：code!=200
 * request: listGroovyRules
 * url: listGroovyRulesURL
 * method: listGroovyRules_TYPE
 * raw_url: listGroovyRules_RAW_URL
 * @param pageNumber - 分页号码,从0开始
 * @param pageSize - 分页大小
 * @param searchBeanName - 查询条件:实例名称，模糊查询
 * @param searchCalculateType - 查询条件:类别，等于
 * @param searchIsEnable - 查询条件:是否启用，等于
 * @param sort - 排序规则，格式: 字段名[,asc|desc]，默认升序，支持多字段排序
 */
export const listGroovyRules = function(parameters = {}) {
  const domain = parameters.$domain ? parameters.$domain : getDomain()
  const config = parameters.$config
  let path = '/api/groovyRules'
  let body
  let queryParameters = {}
  let form = {}
  if (parameters['pageNumber'] !== undefined) {
    queryParameters['pageNumber'] = parameters['pageNumber']
  }
  if (parameters['pageSize'] !== undefined) {
    queryParameters['pageSize'] = parameters['pageSize']
  }
  if (parameters['searchBeanName'] !== undefined) {
    queryParameters['search_beanName'] = parameters['searchBeanName']
  }
  if (parameters['searchCalculateType'] !== undefined) {
    queryParameters['search_calculateType'] = parameters['searchCalculateType']
  }
  if (parameters['searchIsEnable'] !== undefined) {
    queryParameters['search_isEnable'] = parameters['searchIsEnable']
  }
  if (parameters['sort'] !== undefined) {
    queryParameters['sort'] = parameters['sort']
  }
  if (parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
      queryParameters[parameterName] = parameters.$queryParameters[parameterName]
    });
  }
  return request('get', domain + path, body, queryParameters, form, config)
}