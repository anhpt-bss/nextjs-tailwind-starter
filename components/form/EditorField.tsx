'use client'

import _ from 'lodash'
import dynamic from 'next/dynamic'
import React, { useRef } from 'react'
import { useController, Control } from 'react-hook-form'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { getResourceUrl } from '@/utils/helper'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

interface EditorFieldProps {
  name: string
  control: Control<any>
  label?: string
  placeholder?: string
  config?: object
  height?: number | string
  uploadType?: 'base64' | 'api'
  uploadUrl?: string
}

export const EditorField: React.FC<EditorFieldProps> = ({
  name,
  control,
  label,
  placeholder = 'Enter content...',
  config,
  height = '50vh',
  uploadType = 'api',
  uploadUrl = '/api/upload',
}) => {
  const editor = useRef<any>(null)

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control })

  const joditConfig = React.useMemo(
    () => ({
      ...config,
      // all options from https://xdsoft.net/jodit/docs/options.html
      readonly: false,
      placeholder: placeholder,
      /**
       * The internal styles of the editable area. They are intended to change
       * not the appearance of the editor, but to change the appearance of the content.
       * @example
       * ```javascript
       * Jodit.make('#editor', {
       * 		style: {
       * 		 font: '12px Arial',
       * 		 color: '#0c0c0c'
       * 		}
       * });
       * ```
       */
      style: {
        font: '16px Roboto',
        color: '#2c2c2c',
      },
      /**
       *
       * @example
       * ```javascript
       * Jodit.make('#editor', {
       * 		editorStyle: {
       * 		 font: '12px Arial',
       * 		 color: '#0c0c0c'
       * 		}
       * });
       * ```
       */
      containerStyle: {
        font: '16px Roboto',
        color: '#2c2c2c',
      },
      /**
       * Inline editing mode
       */
      inline: false,
      /**
       * Theme (can be "dark")
       * @example
       * ```javascript
       * const editor = Jodit.make(".dark_editor", {
       *      theme: "dark"
       * });
       * ```
       */
      theme: 'default',
      /**
       * Class name that can be appended to the editable area
       */
      editorClassName: 'jodit-editor-input',
      /**
       * Class name that can be appended to the main editor container
       */
      className: 'jodit-editor-container',
      /**
       * Language by default. if `auto` language set by document.documentElement.lang ||
       * (navigator.language && navigator.language.substr(0, 2)) ||
       * (navigator.browserLanguage && navigator.browserLanguage.substr(0, 2)) || 'en'
       *
       * @example
       * ```html
       * <!-- include in you page lang file -->
       * <script src="jodit/lang/de.js"></script>
       * <script>
       * var editor = Jodit.make('.editor', {
       *    language: 'de'
       * });
       * </script>
       * ```
       */
      language: 'en',
      /**
       * Collection of language pack data `{en: {'Type something': 'Type something', ...}}`
       *
       * @example
       * ```javascript
       * const editor = Jodit.make('#editor', {
       *     language: 'ru',
       *     i18n: {
       *         ru: {
       *            'Type something': 'Начните что-либо вводить'
       *         }
       *     }
       * });
       * console.log(editor.i18n('Type something')) //Начните что-либо вводить
       * ```
       */
      i18n: {},
      /**
       * Boolean, whether the toolbar should be shown.
       * Alternatively, a valid css-selector-string to use an element as toolbar container.
       */
      toolbar: true,
      /**
       * Boolean, whether the statusbar should be shown.
       */
      statusbar: true,
      height,
      maxHeight: 'unset',
      /**
       * After resizing, the set of buttons will change to accommodate different sizes.
       */
      toolbarAdaptive: true,
      /**
       * The list of buttons that appear in the editor's toolbar on large places (≥ options.sizeLG).
       */
      buttons: [
        {
          group: 'font-style',
          buttons: [],
        },
        {
          group: 'list',
          buttons: [],
        },
        {
          group: 'font',
          buttons: [],
        },
        '---',
        {
          group: 'script',
          buttons: [],
        },
        {
          group: 'media',
          buttons: [],
        },
        '\n',
        // {
        //     group: 'state',
        //     buttons: []
        // },
        {
          group: 'clipboard',
          buttons: [],
        },
        {
          group: 'insert',
          buttons: [],
        },
        {
          group: 'indent',
          buttons: [],
        },
        {
          group: 'color',
          buttons: [],
        },
        {
          group: 'form',
          buttons: [],
        },
        '---',
        {
          group: 'history',
          buttons: [],
        },
        {
          group: 'search',
          buttons: [],
        },
        {
          group: 'source',
          buttons: [],
        },
        {
          group: 'other',
          buttons: [],
        },
        {
          group: 'info',
          buttons: [],
        },
      ],
      /**
       * The list of buttons that appear in the editor's toolbar for medium-sized spaces (≥ options.sizeMD).
       */
      buttonsMD: [
        {
          group: 'font-style',
          buttons: [],
        },
        {
          group: 'list',
          buttons: [],
        },
        {
          group: 'font',
          buttons: [],
        },
        '---',
        {
          group: 'media',
          buttons: [],
        },
        '\n',
        // {
        //     group: 'state',
        //     buttons: []
        // },
        {
          group: 'insert',
          buttons: [],
        },
        {
          group: 'indent',
          buttons: [],
        },
        {
          group: 'color',
          buttons: [],
        },
        '---',
        {
          group: 'history',
          buttons: [],
        },
        {
          group: 'other',
          buttons: [],
        },
        '|',
        'dots',
      ],
      /**
       * The list of buttons that appear in the editor's toolbar for small-sized spaces (≥ options.sizeSM).
       */
      buttonsSM: [
        {
          group: 'font-style',
          buttons: [],
        },
        {
          group: 'list',
          buttons: [],
        },
        '---',
        {
          group: 'font',
          buttons: [],
        },
        '\n',
        // {
        //     group: 'state',
        //     buttons: []
        // },
        {
          group: 'indent',
          buttons: [],
        },
        {
          group: 'color',
          buttons: [],
        },
        '---',
        {
          group: 'history',
          buttons: [],
        },
        '|',
        'dots',
      ],
      /**
       * The list of buttons that appear in the editor's toolbar for extra-small spaces (less than options.sizeSM).
       */
      buttonsXS: [
        {
          group: 'font-style',
          buttons: [],
        },
        {
          group: 'list',
          buttons: [],
        },
        '---',
        {
          group: 'font',
          buttons: [],
        },
        {
          group: 'color',
          buttons: [],
        },
        '---',
        'dots',
      ],
      /**
       * Module for processing download documents and images by Drag and Drop
       * Drag and Drop files
       */
      enableDragAndDropFileToEditor: true,
      uploader: {
        insertImageAsBase64URI: uploadType === 'base64',
        url: uploadUrl, // Server URL for file upload
        format: 'json',
        method: 'POST',
        isSuccess: (response) => {
          // Response from server
          return response
        },
        process: (response) => {
          // Response from isSuccess
          if (response?.status) {
            return response.data.items || []
          } else {
            return response
          }
        },
        defaultHandlerSuccess: function (response) {
          // Response from process

          console.log(response)

          const j = this.j || this

          if (response?.success === false) {
            const j = this.j || this
            if (!j) return
            j.message.error('Upload failed')
            return
          }

          if (!j || _.isEmpty(response?.data)) {
            return
          }

          response?.data?.forEach((item) => {
            const url = getResourceUrl(item?.path)
            let element

            if (item?.mimetype?.includes('image/')) {
              element = j.createInside.element('img')
              element.setAttribute('src', url)
              element.setAttribute('alt', item.filename)
              element.setAttribute('title', item.filename)
              j.s.insertImage(element, null, j.o.imageDefaultWidth)
            } else {
              element = j.createInside.element('a')
              element.setAttribute('href', url)
              element.setAttribute('target', '_blank')
              element.setAttribute(
                'style',
                'display: flex; align-items: center; text-decoration: none; color: rgb(32, 33, 36); background-color: rgb(245, 245, 245); padding: 10px; border: 1px solid rgb(221, 221, 221); font-size: 14px; line-height: 20px; width: fit-content;'
              )

              const icon = j.createInside.element('span')
              icon.className = 'file-icon'
              icon.textContent = item?.mimetype?.includes('video/')
                ? '🎞️'
                : item?.mimetype?.includes('audio/')
                  ? '🔊'
                  : '📄'
              icon.setAttribute('style', 'margin-right: 8px; font-size: 1.2em;')

              const fileInfo = j.createInside.element('span')
              fileInfo.textContent = ` ${item.filename} (${item.size})`

              element.appendChild(icon)
              element.appendChild(fileInfo)

              j.s.insertNode(element)
            }

            // case 'video': {
            //     element = j.createInside.element('video')
            //     element.setAttribute('controls', '')
            //     element.setAttribute('style', 'width: 100%;')
            //     const videoSource = j.createInside.element('source')
            //     videoSource.setAttribute('src', url)
            //     videoSource.setAttribute('type', `${item?.file_content}/${item?.file_type}`)
            //     element.appendChild(videoSource)
            //     j.s.insertNode(element)
            //     break
            // }

            // case 'audio': {
            //     element = j.createInside.element('audio')
            //     element.setAttribute('controls', '')
            //     const audioSource = j.createInside.element('source')
            //     audioSource.setAttribute('src', url)
            //     audioSource.setAttribute('type', `${item?.file_content}/${item?.file_type}`)
            //     element.appendChild(audioSource)
            //     j.s.insertNode(element)
            //     break
            // }

            // Add a line break after each element
            const br = j.createInside.element('br')
            j.s.insertNode(br)
          })
        },
        defaultHandlerError: function (e) {
          console.log(e)
          const j = this.j || this
          if (j) {
            j.message.error('Upload failed')
          }
        },
      },
    }),
    [placeholder]
  )

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <JoditEditor
              ref={editor}
              value={value || ''}
              config={joditConfig}
              onBlur={(newContent: string) => onChange(newContent)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default EditorField
