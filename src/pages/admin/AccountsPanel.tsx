import { KeyRound, Pencil, Plus, ShieldCheck, Trash2, UserCheck, UserX, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { api } from '../../services/api'
import type { AdminPermission, AdminRole, AdminUser } from '../../types'
import { Field } from './AdminField'

const permissions: Array<[AdminPermission, string, string]> = [
  ['quotes.view', 'Xem báo giá', 'Xem danh sách và chi tiết yêu cầu báo giá.'],
  ['quotes.manage', 'Cập nhật báo giá', 'Thay đổi trạng thái xử lý yêu cầu báo giá.'],
  ['products.manage', 'Quản lý sản phẩm', 'Thêm, sửa, ẩn và xóa sản phẩm.'],
  ['categories.manage', 'Quản lý phân loại', 'Chỉnh ngành hàng và phân nhóm.'],
  ['branding.manage', 'Quản lý thương hiệu', 'Sửa tên, logo, favicon và thông tin liên hệ.'],
  ['content.manage', 'Quản lý nội dung', 'Sửa hero, menu, năng lực và footer.'],
  ['articles.manage', 'Quản lý tin tức', 'Viết, sửa, xuất bản và xóa bài viết.'],
  ['display.manage', 'Quản lý giao diện', 'Sửa màu sắc và trạng thái hiển thị.'],
  ['analytics.view', 'Xem analytics', 'Xem dữ liệu truy cập website.'],
  ['users.manage', 'Quản lý tài khoản', 'Tạo, sửa, khóa và phân quyền tài khoản.'],
  ['system.reset', 'Reset hệ thống', 'Khôi phục dữ liệu mẫu; chỉ dành cho chủ sở hữu.'],
]

const allPermissions = permissions.map(([permission]) => permission)
const presets: Record<AdminRole, AdminPermission[]> = {
  owner: allPermissions,
  administrator: allPermissions.filter(permission => !['users.manage', 'system.reset'].includes(permission)),
  catalog_editor: ['products.manage', 'categories.manage'],
  content_editor: ['branding.manage', 'content.manage', 'articles.manage', 'display.manage'],
  sales: ['quotes.view', 'quotes.manage'],
  viewer: ['quotes.view', 'analytics.view'],
  custom: [],
}
const roleLabels: Record<AdminRole, string> = {
  owner: 'Chủ sở hữu', administrator: 'Quản trị viên', catalog_editor: 'Biên tập catalogue',
  content_editor: 'Biên tập nội dung', sales: 'Kinh doanh', viewer: 'Chỉ xem', custom: 'Quyền tùy chỉnh',
}
type FormState = { username: string; displayName: string; password: string; role: AdminRole; permissions: AdminPermission[]; active: boolean }
const emptyForm = (): FormState => ({ username: '', displayName: '', password: '', role: 'viewer', permissions: presets.viewer, active: true })

export function AccountsPanel({ currentUser }: { currentUser: AdminUser }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [editing, setEditing] = useState<FormState | null>(null)
  const [editingUsername, setEditingUsername] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const canGrantOwner = currentUser.isRoot

  const load = async () => {
    try { setUsers(await api.listAdminUsers()) }
    catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Không tải được danh sách tài khoản') }
  }
  useEffect(() => {
    void api.listAdminUsers().then(setUsers).catch(reason => setMessage(reason instanceof Error ? reason.message : 'Không tải được danh sách tài khoản'))
  }, [])

  const activeCount = useMemo(() => users.filter(user => user.active).length, [users])
  const openCreate = () => { setEditingUsername(null); setEditing(emptyForm()); setMessage('') }
  const openEdit = (user: AdminUser) => {
    setEditingUsername(user.username)
    setEditing({ username: user.username, displayName: user.displayName, password: '', role: user.role, permissions: user.permissions, active: user.active })
    setMessage('')
  }
  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    setBusy(true); setMessage('')
    try {
      if (editingUsername) {
        const target = users.find(user => user.username === editingUsername)
        const profileOnly = target?.isRoot || editingUsername === currentUser.username
        await api.updateAdminUser(editingUsername, profileOnly
          ? { displayName: editing.displayName, password: editing.password || undefined }
          : { displayName: editing.displayName, password: editing.password || undefined, role: editing.role, permissions: editing.permissions, active: editing.active })
      } else {
        await api.createAdminUser(editing)
      }
      await load(); setEditing(null); setEditingUsername(null)
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Không lưu được tài khoản') }
    finally { setBusy(false) }
  }
  const remove = async (user: AdminUser) => {
    if (!confirm(`Xóa tài khoản “${user.username}”? Thao tác này không thể hoàn tác.`)) return
    setBusy(true); setMessage('')
    try { await api.deleteAdminUser(user.username); await load() }
    catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Không xóa được tài khoản') }
    finally { setBusy(false) }
  }

  return <div className="accounts-panel">
    <div className="admin-toolbar"><p>Tài khoản gốc lấy từ Railway được bảo vệ. Mọi quyền đều được kiểm tra lại tại backend.</p><span>{activeCount}/{users.length} đang hoạt động</span><button className="primary-button" onClick={openCreate}><Plus />Thêm tài khoản</button></div>
    {message && !editing && <p className="form-error">{message}</p>}
    <div className="account-list">{users.map(user => <article key={user.username} className={!user.active ? 'account-card account-card--disabled' : 'account-card'}>
      <div className="account-avatar">{user.active ? <UserCheck /> : <UserX />}</div>
      <div><div className="account-name"><strong>{user.displayName}</strong>{user.isRoot && <span><ShieldCheck />Gốc</span>}</div><p>@{user.username}</p><small>Tạo {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}</small></div>
      <div className="account-access"><b>{roleLabels[user.role]}</b><span>{user.permissions.length} quyền · {user.active ? 'Đang hoạt động' : 'Đã khóa'}</span></div>
      <div className="admin-row-actions">{(!user.isRoot || user.username === currentUser.username) && <button title="Sửa tài khoản" onClick={() => openEdit(user)}><Pencil /></button>}{!user.isRoot && <button className="danger" title="Xóa tài khoản" disabled={busy || user.username === currentUser.username} onClick={() => remove(user)}><Trash2 /></button>}</div>
    </article>)}</div>
    {editing && <div className="admin-editor-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null) }}><form className="admin-editor account-editor" onSubmit={save}>
      <div className="admin-editor__head"><div><span className="eyebrow">ACCESS CONTROL</span><h2>{editingUsername ? `Sửa @${editingUsername}` : 'Thêm tài khoản'}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Đóng"><X /></button></div>
      <div className="admin-editor__body">
        <Field label="Tên đăng nhập"><input value={editing.username} disabled={Boolean(editingUsername)} onChange={event => setEditing({ ...editing, username: event.target.value.toLowerCase() })} placeholder="vi-du: kinhdoanh" required /></Field>
        <Field label="Tên hiển thị"><input value={editing.displayName} onChange={event => setEditing({ ...editing, displayName: event.target.value })} required /></Field>
        <Field label={editingUsername ? 'Mật khẩu mới (để trống nếu giữ nguyên)' : 'Mật khẩu (tối thiểu 10 ký tự)'} wide><div className="password-field"><KeyRound /><input type="password" minLength={editingUsername ? undefined : 10} value={editing.password} onChange={event => setEditing({ ...editing, password: event.target.value })} required={!editingUsername} autoComplete="new-password" /></div></Field>
        <Field label="Vai trò" wide><select value={editing.role} disabled={editingUsername === currentUser.username} onChange={event => { const role = event.target.value as AdminRole; setEditing({ ...editing, role, permissions: presets[role] }) }}><option value="administrator">Quản trị viên</option><option value="catalog_editor">Biên tập catalogue</option><option value="content_editor">Biên tập nội dung</option><option value="sales">Kinh doanh</option><option value="viewer">Chỉ xem</option><option value="custom">Quyền tùy chỉnh</option>{canGrantOwner && <option value="owner">Chủ sở hữu</option>}</select></Field>
        <div className="permission-grid admin-field--wide">{permissions.map(([permission, label, description]) => <label key={permission} className="permission-card"><input type="checkbox" checked={editing.permissions.includes(permission)} disabled={editing.role !== 'custom' || editingUsername === currentUser.username} onChange={event => setEditing({ ...editing, permissions: event.target.checked ? [...editing.permissions, permission] : editing.permissions.filter(item => item !== permission) })} /><span><strong>{label}</strong><small>{description}</small></span></label>)}</div>
        {editingUsername && <label className="admin-check admin-field--wide"><input type="checkbox" checked={editing.active} disabled={editingUsername === currentUser.username || users.find(user => user.username === editingUsername)?.isRoot} onChange={event => setEditing({ ...editing, active: event.target.checked })} />Tài khoản đang hoạt động</label>}
      </div>
      {message && <p className="form-error editor-error">{message}</p>}
      <div className="admin-editor__footer"><button type="button" className="secondary-button" onClick={() => setEditing(null)}>Hủy</button><button className="primary-button" disabled={busy}>{busy ? 'Đang lưu...' : 'Lưu tài khoản'}</button></div>
    </form></div>}
  </div>
}
