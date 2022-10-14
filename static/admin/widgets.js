// Custom Netlify-CMS Widgets
// @link https://www.netlifycms.org/docs/custom-widgets/


/**
 * ReadOnly Widget
 */
; (function () {
    const CMS = window.CMS
    const createClass = window.createClass
    const h = window.h

    const ReadOnlyControl = createClass({
        render: function () {
            const placeholder = this.props.field.get('placeholder', '')
            const value = this.props.value
            return h('input', {
                id: this.props.forID,
                className: this.props.classNameWrapper,
                type: 'text',
                value: value || placeholder,
                disabled: true,
                style: {
                    cursor: 'not-allowed',
                    color: 'hsl(0, 0%, 56%)',
                    backgroundColor: 'hsl(0, 0%, 92%)',
                },
            })
        },
    })

    const ReadOnlyPreview = createClass({
        render: function () {
            return ''
        },
    })

    const schema = {
        properties: {
            placeholder: { type: 'string' }
        }
    }

    CMS.registerWidget('readonly', ReadOnlyControl, ReadOnlyPreview, schema)
})()
