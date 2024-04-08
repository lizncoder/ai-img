// 百度智能云请求固定参数
export const AIIMG = {
  GRANTTYPE: 'client_credentials',
  CLIENTID: 'mwyj8QgyJ6PiqYb2PDTBgylN',
  CLIENTSECRET: 'or8bPDRhKJbnggSQSNj04c6LuHfbznyR',
};

// 百度智能云图像相关API
export const AIIMGAPI = {
  // 图像修复
  postImageDefinitionEnhance:
    'https://aip.baidubce.com/rest/2.0/image-process/v1/image_definition_enhance',
  // 黑白图片上色
  postImageColorization:
    'https://aip.baidubce.com/rest/2.0/image-process/v1/colourize',
};
