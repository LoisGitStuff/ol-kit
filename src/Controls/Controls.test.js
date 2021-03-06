import React from 'react'
import { mount, shallow } from 'enzyme'
import olMap from 'ol/Map'
import { Controls } from 'Controls'

// we re-create the mock for each test
let mockMap

describe('<Controls />', () => {
  // jest does not reset the DOM after each test, so we do this manually
  beforeEach(() => {
    document.body.innerHTML = `<div id='map' width='1200px' height='800px'></div>`
    mockMap = new olMap({
      controls: [],
      target: 'map'
    })
  })

  it('should shallow controls default position', () => {
    const wrapper = shallow(<Controls map={mockMap} />)

    expect(wrapper).toMatchSnapshot()
  })
  it('should shallow controls in top left', () => {
    const wrapper = shallow(<Controls map={mockMap} position='top-left' />)

    expect(wrapper).toMatchSnapshot()
  })
  it('should shallow controls in top right', () => {
    const wrapper = shallow(<Controls map={mockMap} position='top-right' />)

    expect(wrapper).toMatchSnapshot()
  })
  it('should shallow controls in bottom left', () => {
    const wrapper = shallow(<Controls map={mockMap} position='bottom-left' />)

    expect(wrapper).toMatchSnapshot()
  })
})

describe('Compass interactions', () => {
  it('should rotate map counter-clockwise', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialRotation = mockMap.getView().getRotation()

    expect(initialRotation).toBe(0)
    // click rotate map left arrow
    wrapper.find('#_ol_kit_rotate_left').simulate('click')
    expect(mockMap.getView().getRotation()).toBe(-0.39269908169872414)
  })
  it('should rotate map to true north', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialRotation = mockMap.getView().getRotation()

    expect(initialRotation).not.toBe(0)
    // click true north arrow
    wrapper.find('#_ol_kit_true_north').simulate('click')
    expect(mockMap.getView().getRotation()).toBe(0)
  })
  it('should rotate map clockwise', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialRotation = mockMap.getView().getRotation()

    expect(initialRotation).toBe(0)
    // click rotate map right arrow
    wrapper.find('#_ol_kit_rotate_right').simulate('click')
    expect(mockMap.getView().getRotation()).toBe(0.39269908169872414)
  })
})

describe('Zoom control interactions', () => {
  it('a click should zoom the map one increment', () => {
    // zoom is undefined if we don't set it programmatically
    mockMap.getView().setZoom(8)

    const wrapper = mount(<Controls map={mockMap} />)
    const initialZoom = mockMap.getView().getZoom()

    expect(initialZoom).toBe(8)

    // click the zoom in button
    wrapper.find('[data-testid="_ol_kit_zoom_in"]').first().prop('onMouseDown')()
    wrapper.find('[data-testid="_ol_kit_zoom_in"]').first().prop('onMouseUp')()

    expect(mockMap.getView().getZoom()).toBe(8.5)
  })

  it('a click and hold should continuously zoom the map in', done => {
    // zoom is undefined if we don't set it programmatically
    mockMap.getView().setZoom(8)

    const wrapper = mount(<Controls map={mockMap} />)
    const initialZoom = mockMap.getView().getZoom()

    expect(initialZoom).toBe(8)

    // mousedown on the zoom in button
    wrapper.find('[data-testid="_ol_kit_zoom_in"]').first().prop('onMouseDown')()

    setTimeout(() => {
      wrapper.find('[data-testid="_ol_kit_zoom_in"]').first().prop('onMouseUp')()

      expect(mockMap.getView().getZoom()).toBeGreaterThan(9)

      done()
    }, 3000)
  })

  it('should zoom map out', () => {
    // zoom is undefined if we don't set it programmatically
    mockMap.getView().setZoom(8)

    const wrapper = mount(<Controls map={mockMap} />)
    const initialZoom = mockMap.getView().getZoom()

    expect(initialZoom).toBe(8)

    // click the zoom out button
    wrapper.find('[data-testid="_ol_kit_zoom_out"]').first().prop('onMouseDown')()
    wrapper.find('[data-testid="_ol_kit_zoom_out"]').first().prop('onMouseUp')()

    expect(mockMap.getView().getZoom()).toBe(7.5)
  })

  it('a click and hold should continuously zoom the map out', done => {
    // zoom is undefined if we don't set it programmatically
    mockMap.getView().setZoom(8)

    const wrapper = mount(<Controls map={mockMap} />)
    const initialZoom = mockMap.getView().getZoom()

    expect(initialZoom).toBe(8)

    // mousedown on the zoom in button
    wrapper.find('[data-testid="_ol_kit_zoom_out"]').first().prop('onMouseDown')()

    setTimeout(() => {
      wrapper.find('[data-testid="_ol_kit_zoom_out"]').first().prop('onMouseUp')()

      expect(mockMap.getView().getZoom()).toBeLessThan(7)

      done()
    }, 3000)
  })
})
