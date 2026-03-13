import { getPage, getDetail, delList, postList, putList } from '@/api/admin/system/dict'
export const useData = () => {

  const pageOptions = computed(() => {
    return {
      API: {
        getPage: getPage,
        detailApi: getDetail,
        delApi: delList,
        putApi: putList,
        postApi: postList
      },

      search: {
        enableCreate: true,
        searchOptions: [
          {
            type: 'string',
            label: '字段',
            name: 'dictCode'
          },

        ]
      },
      table: {
        className: '',
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            align: 'left',
            customRender: ({ index }) => index + 1,
            width: 80
          },
          {
            title: 'id',
            dataIndex: 'id',
            align: 'left',
            width: 80
          },
          {
            title: '键',
            dataIndex: 'valuee',
            align: 'left',
            width: 80
          },
          {
            title: '值',
            dataIndex: 'name',
            align: 'left',
            width: 80
          },
          {
            title: '备注',
            dataIndex: 'remark',
            align: 'left',
            width: 100
          },

          {
            title: '字段',
            dataIndex: 'dictCode',
            align: 'left',
            width: 80
          },
          {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            width: 100,
            align: 'left',
            fixed: 'right'
          }
        ],
        actions: [
          {
            label: '详情',
            key: 2,
            local: true,
            labelShow: true
          },
          {
            label: '编辑',
            key: 1,
            local: true,
            labelShow: true
          },

          {
            label: '删除',
            key: 3,
            labelShow: true
          }
        ],
        initParam: {},
        rowKey: 'id',
        scroll: { x: 1000 },
        init: true
      },
      modal: {
        config: {
          title: '字典'
        },
        form: {
          config: {
            labelCol: { span: 2 }
          },
          fields: [
            {
              label: '名称',
              name: 'name',
              rules: [{ required: true, message: '请输入名称' }],
              type: 'input',
              config: {
                placeholder: '请输入名称'
              }
            },
            // {
            //   label: '名称',
            //   name: 'name',
            //   rules: [{ required: true, message: '请输入名称' }],
            //   type: 'component',
            //   component: baseUpload,
            //   config: {
            //     placeholder: '请输入名称',
            //     accept: 'image/jpeg'
            //   }
            // },
            // {
            //   label: '名称',
            //   name: 'name',
            //   rules: [{ required: true, message: '请输入名称' }],
            //   type: 'datepicker',
            //   config: {

            //     format: 'YYYY-MM-DD HH:mm:ss',
            //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
            //   }
            // },
            {
              label: '值',
              name: 'valuee',
              rules: [{ required: true, message: '请输入值' }],
              type: 'input',
              config: {
                placeholder: '请输入值'
              }
            },
            {
              label: '标识',
              name: 'dictCode',
              rules: [{ required: true, message: '请输入标识' }],
              type: 'input',
              config: {
                placeholder: '请输入标识'
              }
            },
            {
              label: '备注',
              name: 'remark',
              rules: [{ required: true, message: '请输入备注' }],
              type: 'textarea',
              config: {
                placeholder: '请输入备注'
              }
            }
          ]
        }
      }
    }
  })

  return { pageOptions }
}
