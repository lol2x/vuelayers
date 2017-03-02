import uuid from 'node-uuid'
import exposeInject from 'vl-mixins/expose-inject'
import rxSubs from 'vl-mixins/rx-subs'

const props = {
  id: {
    type: [ String, Number ],
    default: () => uuid.v4()
  },
  opacity: {
    type: Number,
    default: 1
  },
  minResolution: Number,
  maxResolution: Number,
  visible: {
    type: Boolean,
    default: true
  },
  extent: {
    type: Array,
    validator: value => value.length === 4
  },
  zIndex: {
    type: Number,
    default: 0
  }
}

const methods = {
  /**
   * Updates layer state
   */
  refresh () {
    this.layer.changed()

    const source = this.layer.getSource()
    source && source.changed()
  },
  initialize () {
    /**
     * @type {ol.layer.Layer}
     * @protected
     */
    this.layer = this.createLayer()
    this.layer.vm = this
    this.layer.set('id', this.id)
  },
  /**
   * @return {ol.layer.Layer}
   * @protected
   */
  createLayer () {
    throw new Error('Not implemented method')
  },
  /**
   * @protected
   */
  mountLayer () {
    this.map.addLayer(this.layer)
  },
  /**
   * @protected
   */
  unmountLayer () {
    this.map.removeLayer(this.layer)
  },
  /**
   * @return {{layer: *}}
   * @protected
   */
  expose () {
    return {
      ...this.$parent.expose(),
      layer: this.layer
    }
  }
}

const watch = {
  maxResolution (value) {
    this.layer.setMaxResolution(value)
  },
  minResolution (value) {
    this.layer.setMinResolution(value)
  },
  opacity (value) {
    this.layer.setOpacity(value)
  },
  visible (value) {
    this.layer.setVisible(value)
  },
  zIndex (value) {
    this.layer.setZIndex(value)
  }
}

export default {
  mixins: [ exposeInject, rxSubs ],
  inject: [ 'map', 'view' ],
  props,
  methods,
  watch,
  render (h) {
    return h('i', {
      style: {
        display: 'none !important'
      }
    }, this.$slots.default)
  },
  created () {
    this.initialize()
  },
  mounted () {
    this.mountLayer()
  },
  beforeDestroy () {
    this.unmountLayer()
  },
  destroyed () {
    this.layer = undefined
  }
}