import { createSchemaField } from '@formily/react'
import {
  FormItem,
  Input,
  NumberPicker,
  Switch,
  Select,
} from '@formily/antd-v5'

export const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    Switch,
    Select,
    'Input.TextArea': Input.TextArea,
  },
})
