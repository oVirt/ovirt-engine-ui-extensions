import React from 'react'
import { act } from 'react-dom/test-utils'
import { configure, mount, shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import withTargetHosts from './VmMigrateDataProvider'
import { engineGet } from '../../../utils/fetch'
import {respondToUrl} from './VmMigrateDataProviderHook.test'

jest.mock('../../../utils/fetch')

const Foo = (props) => {
  return (
    <React.Fragment>
      {JSON.stringify(props)}
    </React.Fragment>)
}

const ConnectedFoo = withTargetHosts(Foo)

configure({ adapter: new EnzymeAdapter() })

describe('Vm Migrate Data Provider HOC', () => {
  it('shoult report isLoading at start up', () => {
    const wrapper = shallow(<ConnectedFoo vmIds={['A', 'B']} />)
    const expected = {
      isLoading: true,
      targetHostItems: [],
      vmNames: [],
      checkVmAffinity: false
    }
    expect(wrapper.props()).toEqual(expect.objectContaining(expected))
  })

  it('should not display content on error', async () => {
    let wrapper
    const fetchData = () => { throw new Error('some server error') }
    engineGet.mockImplementation(fetchData)
    await act(async () => {
      wrapper =
      mount(<ConnectedFoo vmIds={['A_id']} />)
    })

    await act(async () => wrapper.update())

    expect(wrapper.find(Foo)).toEqual({})
  })

  it('should render content', async () => {
    const resultGenerator = (function * () {
      yield Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield Promise.resolve({host: [{id: 'B_id', name: 'B_name'}]})
      yield Promise.resolve({host: [{id: 'B_id', name: 'B_name'}]})
    })()
    let wrapper
    engineGet.mockImplementation(() => resultGenerator.next().value)
    await act(async () => { wrapper = mount(<ConnectedFoo vmIds={['A_id']} />) })
    const expected = {
      isLoading: false,
      targetHostItems: [{text: 'B_name', value: 'B_id'}],
      vmNames: ['A_name'],
      checkVmAffinity: false
    }
    wrapper.update()
    expect(wrapper.find(Foo).props()).toEqual(expect.objectContaining(expected))
  })

  it('should switch to hosts with affinity after flag is toggled', async () => {
    const resultGenerator = (function * () {
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield respondToUrl({
        hosts: Promise.resolve({host: [{id: 'B_id', name: 'B_name'}]}),
        hostsWithAffinity: Promise.resolve({host: [{id: 'C_id', name: 'C_name'}]})
      })
      yield respondToUrl({
        hosts: Promise.resolve({host: [{id: 'B_id', name: 'B_name'}]}),
        hostsWithAffinity: Promise.resolve({host: [{id: 'C_id', name: 'C_name'}]})
      })
    })()
    let wrapper
    engineGet.mockImplementation((url) => resultGenerator.next().value(url))

    await act(async () => { wrapper = mount(<ConnectedFoo vmIds={['A_id']} />) })
    wrapper.update()

    expect(wrapper.find(Foo).props()).toEqual(expect.objectContaining({
      isLoading: false,
      targetHostItems: [{value: 'B_id', text: 'B_name'}],
      vmNames: ['A_name'],
      checkVmAffinity: false
    }))

    const onRefreshHosts = wrapper.find(Foo).prop('onRefreshHosts')
    await act(async () => onRefreshHosts(true))
    wrapper.update()

    expect(wrapper.find(Foo).props()).toEqual(expect.objectContaining({
      isLoading: false,
      targetHostItems: [{value: 'C_id', text: 'C_name'}],
      vmNames: ['A_name'],
      checkVmAffinity: true
    }))
  })
})
