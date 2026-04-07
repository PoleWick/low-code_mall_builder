import type { ISchema } from '@formily/json-schema'

interface DividerProps {
  height?: number
  backgroundColor?: string
  marginTop?: number
  marginBottom?: number
}

const Divider = ({ height = 8, backgroundColor = '#f5f5f5', marginTop = 0, marginBottom = 0 }: DividerProps) => (
  <div style={{ height, backgroundColor, marginTop, marginBottom }} />
)

export const dividerSchema: ISchema = {
  type: 'object',
  properties: {
    height:          { type: 'number', title: '高度(px)', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 1, max: 60 } },
    backgroundColor: { type: 'string', title: '颜色', 'x-decorator': 'FormItem', 'x-component': 'Input', 'x-component-props': { placeholder: '#f5f5f5' } },
    marginTop:       { type: 'number', title: '上间距(px)', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 0 } },
    marginBottom:    { type: 'number', title: '下间距(px)', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 0 } },
  },
}

export const dividerDefaultProps: DividerProps = {
  height: 8,
  backgroundColor: '#f5f5f5',
  marginTop: 0,
  marginBottom: 0,
}

export default Divider
