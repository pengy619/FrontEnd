/**
 * Created by zss on 2017/11/11.
 */
export const getLeftMenus = state => {
  return state.currentLeft
}
export const getMenus = state => {
  return state.menus
}
export const getActiveLeft = state => {
  let activeLeft
  if(state.activeLeft.length==0){
    activeLeft='/'
  }else{
    activeLeft=state.activeLeft[1].url
  }
  return activeLeft
}
