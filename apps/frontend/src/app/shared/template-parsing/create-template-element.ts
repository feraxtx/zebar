import { Accessor, createEffect, on, onCleanup, onMount } from 'solid-js';

import { TemplateElementConfig } from '../user-config';
import { insertAndReplace } from '../utils';
import { parseTemplate } from './parse-template';
import { TemplateBindings } from './template-bindings.model';
import { useLogger } from '../logging';

export interface CreateTemplateElementProps {
  config: Accessor<TemplateElementConfig>;
  bindings: Accessor<TemplateBindings>;
  defaultTemplate: Accessor<string>;
}

export function createTemplateElement(props: CreateTemplateElementProps) {
  const logger = useLogger(
    `.${props.config().class_name}#${props.config().id}`,
  );

  const element = document.createElement('div');
  element.id = props.config().id;

  createEffect(
    on(
      () => props.bindings(),
      bindings => {
        const mount = document.getElementById(props.config().id)!;

        const dispose = insertAndReplace(mount, () =>
          parseTemplate(
            props.config().template ?? props.defaultTemplate(),
            bindings,
          ),
        );

        onCleanup(() => dispose());
      },
    ),
  );

  onMount(() => logger.debug('Mounted'));
  onCleanup(() => logger.debug('Cleanup'));

  return element;
}
