/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import _ from 'lodash'

import { getResourceUrl } from '@/utils/helper'

export const defaultJoditConfig = {
  // all options from https://xdsoft.net/jodit/docs/options.html
  readonly: false,
  placeholder: 'Start typing...',
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
  height: '50vh',
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
    insertImageAsBase64URI: false,
    url: '/api/upload', // Server URL for file upload
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
        const url = getResourceUrl(item)
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
}

export const LANG_VI = {
  'Type something': 'Nhập gì đó...',
  Advanced: 'Nâng cao',
  'About Jodit': 'Về Jodit',
  'Jodit Editor': 'Jodit Editor',
  "Jodit User's Guide": 'Hướng dẫn sử dụng Jodit',
  'contains detailed help for using': 'chứa hướng dẫn chi tiết về cách sử dụng',
  'For information about the license, please go to our website:':
    'Để biết thông tin về giấy phép, vui lòng truy cập trang web của chúng tôi:',
  'Buy full version': 'Mua phiên bản đầy đủ',
  'Copyright © XDSoft.net - Chupurnov Valeriy. All rights reserved.':
    'Bản quyền © XDSoft.net - Chupurnov Valeriy. Đã đăng ký bản quyền.',
  Anchor: 'Neo',
  'Open in new tab': 'Mở trong tab mới',
  'Open in fullsize': 'Mở kích thước đầy đủ',
  'Clear Formatting': 'Xóa định dạng',
  'Fill color or set the text color': 'Màu nền hoặc màu chữ',
  Redo: 'Làm lại',
  Undo: 'Hoàn tác',
  Bold: 'In đậm',
  Italic: 'In nghiêng',
  'Insert Unordered List': 'Chèn danh sách không thứ tự',
  'Insert Ordered List': 'Chèn danh sách có thứ tự',
  'Align Center': 'Căn giữa',
  'Align Justify': 'Căn đều',
  'Align Left': 'Căn trái',
  'Align Right': 'Căn phải',
  'Insert Horizontal Line': 'Chèn đường ngang',
  'Insert Image': 'Chèn hình ảnh',
  'Insert file': 'Chèn tệp',
  'Insert youtube/vimeo video': 'Chèn video youtube/vimeo',
  'Insert link': 'Chèn liên kết',
  'Speech Recognize': 'Nhận dạng giọng nói',
  Sound: 'Âm thanh',
  'Interim Results': 'Kết quả tạm thời',
  Spellcheck: 'Kiểm tra chính tả',
  'Font size': 'Kích thước chữ',
  'Font family': 'Phông chữ',
  'Insert format block': 'Chèn khối định dạng',
  'Line height': 'Chiều cao dòng',
  Normal: 'Bình thường',
  'Heading 1': 'Tiêu đề 1',
  'Heading 2': 'Tiêu đề 2',
  'Heading 3': 'Tiêu đề 3',
  'Heading 4': 'Tiêu đề 4',
  Quote: 'Trích dẫn',
  Code: 'Mã',
  Insert: 'Chèn',
  'Insert table': 'Chèn bảng',
  'Decrease Indent': 'Giảm thụt lề',
  'Increase Indent': 'Tăng thụt lề',
  'Select Special Character': 'Chọn ký tự đặc biệt',
  'Insert Special Character': 'Chèn ký tự đặc biệt',
  'Paint format': 'Sao chép định dạng',
  'Change mode': 'Thay đổi chế độ',
  Margins: 'Lề',
  top: 'trên',
  right: 'phải',
  bottom: 'dưới',
  left: 'trái',
  Styles: 'Kiểu CSS',
  Classes: 'Lớp CSS',
  Align: 'Căn',
  Right: 'Phải',
  Center: 'Giữa',
  Left: 'Trái',
  '--Not Set--': '--Chưa đặt--',
  Src: 'Nguồn',
  Title: 'Tiêu đề',
  Alternative: 'Văn bản thay thế',
  Filter: 'Lọc',
  Link: 'Liên kết',
  'Open link in new tab': 'Mở liên kết trong tab mới',
  Image: 'Hình ảnh',
  file: 'Tệp',
  'Image properties': 'Thuộc tính hình ảnh',
  Cancel: 'Hủy',
  Ok: 'Đồng ý',
  'Your code is similar to HTML. Keep as HTML?': 'Mã của bạn giống HTML. Giữ dưới dạng HTML?',
  'Paste as HTML': 'Dán dưới dạng HTML?',
  Keep: 'Giữ',
  Clean: 'Làm sạch',
  'Insert as Text': 'Chèn dưới dạng văn bản',
  'Word Paste Detected': 'Phát hiện dán từ Word',
  'The pasted content is coming from a Microsoft Word/Excel document. Do you want to keep the format or clean it up?':
    'Nội dung dán đến từ tài liệu Microsoft Word/Excel. Bạn có muốn giữ định dạng hoặc làm sạch nó?',
  'Insert only Text': 'Chỉ chèn văn bản',
  'File Browser': 'Trình duyệt tệp',
  'Error on load list': 'Lỗi khi tải danh sách',
  'Error on load folders': 'Lỗi khi tải thư mục',
  'Are you sure?': 'Bạn có chắc không?',
  'Enter Directory name': 'Nhập tên thư mục',
  'Create directory': 'Tạo thư mục',
  'type name': 'nhập tên',
  'Drop image': 'Thả hình ảnh',
  'Drop file': 'Thả tệp',
  'or click': 'hoặc nhấp',
  'Alternative text': 'Văn bản thay thế',
  Browse: 'Duyệt',
  Upload: 'Tải lên',
  Background: 'Nền',
  Text: 'Văn bản',
  Top: 'Trên',
  Middle: 'Giữa',
  Bottom: 'Dưới',
  'Insert column before': 'Chèn cột trước',
  'Insert column after': 'Chèn cột sau',
  'Insert row above': 'Chèn hàng trên',
  'Insert row below': 'Chèn hàng dưới',
  'Delete table': 'Xóa bảng',
  'Delete row': 'Xóa hàng',
  'Delete column': 'Xóa cột',
  'Empty cell': 'Ô trống',
  Delete: 'Xóa',
  'Strike through': 'Gạch ngang',
  Underline: 'Gạch chân',
  Break: 'Ngắt',
  'Search for': 'Tìm kiếm',
  'Replace with': 'Thay thế bằng',
  Replace: 'Thay thế',
  Edit: 'Chỉnh sửa',
  'Vertical align': 'Căn dọc',
  'Horizontal align': 'Căn ngang',
  'Sort by changed': 'Sắp xếp theo thay đổi',
  'Sort by name': 'Sắp xếp theo tên',
  'Sort by size': 'Sắp xếp theo kích thước',
  'Add folder': 'Thêm thư mục',
  Split: 'Chia',
  'Split vertical': 'Chia dọc',
  'Split horizontal': 'Chia ngang',
  Merge: 'Gộp',
  'Add column': 'Thêm cột',
  'Add row': 'Thêm hàng',
  Border: 'Viền',
  'Embed code': 'Nhúng mã',
  Update: 'Cập nhật',
  superscript: 'chỉ số trên',
  subscript: 'chỉ số dưới',
  'Cut selection': 'Cắt lựa chọn',
  Paste: 'Dán',
  'Choose Content to Paste': 'Chọn nội dung để dán',
  'Chars: %d': 'Ký tự: %d',
  'Words: %d': 'Từ: %d',
  All: 'Tất cả',
  'Select %s': 'Chọn: %s',
  'Select all': 'Chọn tất cả',
  source: 'HTML',
  bold: 'đậm',
  italic: 'nghiêng',
  brush: 'Chổi',
  link: 'Liên kết',
  undo: 'hoàn tác',
  redo: 'làm lại',
  table: 'Bảng',
  image: 'Hình ảnh',
  eraser: 'Tẩy',
  paragraph: 'Đoạn văn',
  fontsize: 'Kích thước chữ',
  video: 'Video',
  font: 'Phông chữ',
  about: 'Về',
  print: 'In',
  underline: 'gạch chân',
  strikethrough: 'gạch ngang',
  indent: 'thụt lề',
  outdent: 'giảm thụt lề',
  fullsize: 'Kích thước đầy đủ',
  shrink: 'Thu nhỏ',
  hr: 'đường ngang',
  ul: 'danh sách không thứ tự',
  ol: 'danh sách có thứ tự',
  cut: 'Cắt',
  selectall: 'Chọn tất cả',
  'Open link': 'Mở liên kết',
  'Edit link': 'Chỉnh sửa liên kết',
  'No follow': 'Không theo dõi',
  Unlink: 'Bỏ liên kết',
  Eye: 'Xem',
  pencil: 'Chỉnh sửa',
  ' URL': 'URL',
  Reset: 'Đặt lại',
  Save: 'Lưu',
  'Save as ...': 'Lưu dưới dạng...',
  Resize: 'Thay đổi kích thước',
  Crop: 'Cắt',
  Width: 'Chiều rộng',
  Height: 'Chiều cao',
  'Keep Aspect Ratio': 'Giữ tỷ lệ khung hình',
  Yes: 'Có',
  No: 'Không',
  Remove: 'Gỡ bỏ',
  Select: 'Chọn',
  'You can only edit your own images. Download this image on the host?':
    'Bạn chỉ có thể chỉnh sửa hình ảnh của chính mình. Tải hình ảnh này lên máy chủ?',
  'The image has been successfully uploaded to the host!':
    'Hình ảnh đã được tải lên máy chủ thành công!',
  palette: 'bảng màu',
  'There are no files': 'Không có tệp nào trong thư mục này.',
  Rename: 'đổi tên',
  'Enter new name': 'Nhập tên mới',
  preview: 'xem trước',
  download: 'Tải về',
  'Paste from clipboard': 'Dán từ bảng tạm',
  "Your browser doesn't support direct access to the clipboard.":
    'Trình duyệt của bạn không hỗ trợ truy cập trực tiếp vào bảng tạm.',
  'Copy selection': 'Sao chép lựa chọn',
  copy: 'sao chép',
  'Border radius': 'Bán kính viền',
  'Show all': 'Hiển thị tất cả',
  Apply: 'Áp dụng',
  'Please fill out this field': 'Vui lòng điền vào trường này',
  'Please enter a web address': 'Vui lòng nhập địa chỉ web',
  Default: 'Mặc định',
  Circle: 'Hình tròn',
  Dot: 'Chấm',
  Quadrate: 'Hình vuông',
  'Lower Alpha': 'Chữ thường',
  'Lower Greek': 'Chữ Hy Lạp thường',
  'Lower Roman': 'Số La Mã thường',
  'Upper Alpha': 'Chữ hoa',
  'Upper Roman': 'Số La Mã hoa',
  Find: 'Tìm',
  'Find Previous': 'Tìm trước',
  'Find Next': 'Tìm tiếp',
  'Insert className': 'Chèn tên lớp',
  'Press Alt for custom resizing': 'Nhấn Alt để thay đổi kích thước tùy chỉnh',
}
