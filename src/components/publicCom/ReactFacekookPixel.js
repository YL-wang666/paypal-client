/**
 * 
 * @param {事件类型默认为标准事件} eventType 
 * @param {事件名称} eventName 
 * @param {事件名称中所对应的可以传递的参数，参数对象中的属性值具体参考文档} params 
 * @param {事件ID} facebookPixelId 
 * 文档：https://developers.facebook.com/docs/meta-pixel/reference
 */
 export const reactFacekookPixel = (eventName,params={},eventType='track',facebookPixelId='358028493278412') => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(facebookPixelId) // facebookPixelId
        ReactPixel.pageView()
        ReactPixel.fbq(eventType,eventName,{...params});
      })
  }
