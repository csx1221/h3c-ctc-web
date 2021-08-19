// props: node_wrap
/* eslint-disable */
export default {

    inserted(el, binding, vnode) {
        var vm = vnode.context;
        var resize = true
        if (el && el.parentNode) {
            var node_wrap = binding.value.params//最外节点
            var visualFlag = false
            var parentWidth = ''
            var PC = ''
            var endX = ''
            var parentOffsetX = 0
            var _el = el
            var _mouseDown = ''
            var _mouseMove = ''
            var _mouseUp = ''
            var clientWidth = ''
            var maxWidth = 50
            var minWidth = 15
            var util = {
                bindEvent(el, binding, vnode) {
                    _el.addEventListener(_mouseDown, util.down, false)
                },
                down() {
                    //浏览器宽
                    clientWidth = parseFloat(util.getCurStyle(node_wrap['node_wrap'], 'width'))//总宽
                    parentWidth = parseFloat(util.getCurStyle(_el.parentNode, 'width'))
                    parentOffsetX = parseFloat(node_wrap['node_wrap'].getBoundingClientRect().left)//  距离左边 padding
                    document.addEventListener(_mouseMove, util.move, false)
                    document.addEventListener(_mouseUp, util.up, false)
                },
                move(e) {
                    var e = e || window.event
                    e.preventDefault()
                    endX = parseFloat(PC ? e.clientX : e.touches[0].clientX)
                    parentWidth = (endX - parentOffsetX)/clientWidth*100
                    parentWidth > maxWidth ? (parentWidth = maxWidth) : parentWidth
                    parentWidth < minWidth ? (parentWidth = minWidth) : parentWidth

                    _el.parentNode.style.width = parentWidth + '%'
                    if (_el.parentNode.nextElementSibling) {
                        _el.parentNode.nextElementSibling.style.width = 100 - parentWidth + '%'
                    }
                },
                up() {
                    document.removeEventListener(_mouseMove, util.move, false)
                    document.removeEventListener(_mouseUp, util.up, false)
                    if (visualFlag) {
                      vm.$emit('watchEcharts', {})
                    }
                },
                getCurStyle(obj, prop) {
                    if (obj.currentStyle) {
                        return obj.currentStyle[prop];
                    }
                    else if (window.getComputedStyle) {
                        prop = prop.replace(/([A-Z])/g, "-$1");
                        prop = prop.toLowerCase();
                        return window.getComputedStyle(obj, '').getPropertyValue(prop);
                    }
                    return null;
                },
                funcIsPc() {
                    var userAgentInfo = navigator.userAgent;
                    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
                    var isPC = true;
                    for (var v = 0; v < Agents.length; v++) {
                        if (userAgentInfo.indexOf(Agents[v]) > 0) {
                            isPC = false;
                            break;
                        }
                    }
                    PC = isPC
                    if (isPC) {
                        _mouseDown = 'mousedown'
                        _mouseMove = 'mousemove'
                        _mouseUp = 'mouseup'
                    } else {
                        _mouseDown = 'touchstart'
                        _mouseMove = 'touchmove'
                        _mouseUp = 'touchend'
                    }
                    return isPC;
                },

            }
            vm.$nextTick(() => {
                visualFlag = node_wrap['visualFlag'] ? node_wrap['maxWidth'] : false
                maxWidth = node_wrap['maxWidth'] ? node_wrap['maxWidth'] : 50
                minWidth = node_wrap['minWidth'] ? node_wrap['minWidth'] : 15
                util.funcIsPc()
                util.bindEvent()
            })
        }
    },
    unbind() {
        // window.removeEventListener('resize', util.listenResize)
    }
}




