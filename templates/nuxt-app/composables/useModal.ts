import { shallowRef, type Component } from 'vue'

interface ModalInstance<TProps = Record<string, unknown>> {
  component: Component
  props: TProps
  resolveFn: (value: unknown) => void
}

const modalStack = shallowRef<ModalInstance[]>([])

export function useModal() {
  function open<TResult = unknown, TProps extends Record<string, unknown> = Record<string, unknown>>(
    component: Component,
    props?: TProps,
  ): Promise<TResult | undefined> {
    return new Promise<TResult | undefined>((resolve) => {
      modalStack.value = [
        ...modalStack.value,
        {
          component,
          props: props ?? {},
          resolveFn: resolve as (value: unknown) => void,
        },
      ]
    })
  }

  function close<T = unknown>(data?: T): void {
    const modal = modalStack.value[modalStack.value.length - 1]
    modalStack.value = modalStack.value.slice(0, -1)
    modal?.resolveFn(data)
  }

  return {
    modalStack,
    openModal: open,
    close,
  }
}
