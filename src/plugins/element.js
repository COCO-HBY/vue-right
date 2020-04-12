import Vue from 'vue'
import {Button, Form, FormItem, Input, Message, Backtop} from 'element-ui'
import {Main, Container, Aside, Header} from 'element-ui'
import {Menu, MenuItem, Submenu} from 'element-ui'
import {Breadcrumb, BreadcrumbItem} from 'element-ui'
import {Card, Row, Col, Tag, Tree} from 'element-ui'
import {Table, TableColumn, Pagination, Dialog, MessageBox} from 'element-ui'
import {Select, Option, Avatar,Dropdown, DropdownItem, DropdownMenu} from 'element-ui'
import {Popover, Scrollbar,Switch} from 'element-ui'
import { Loading } from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Main)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Avatar)
Vue.use(Backtop)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Popover)
Vue.use(Switch)
Vue.use(Scrollbar)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading
