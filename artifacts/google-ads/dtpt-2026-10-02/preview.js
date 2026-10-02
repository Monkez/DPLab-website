(() => {
  'use strict';
  const kit = window.DTPT_KIT;
  const icons = window.DTPT_ICONS;
  let selectedGroup = kit.ad_groups[0];
  let variant = 0;
  let toastTimer;
  const byId = (id) => document.getElementById(id);
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const icon = (name) => {
    const element = node('span');
    element.innerHTML = icons[name] || '';
    return element;
  };
  const link = (text, url, className) => {
    const element = node('a', className, text);
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener';
    return element;
  };
  const notify = (message) => {
    const toast = byId('toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2500);
  };
  const copy = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = node('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '-10000px';
        document.body.append(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        textarea.remove();
        if (!success) throw new Error('Clipboard unavailable');
      }
      notify('Đã sao chép');
    } catch {
      notify('Trình duyệt không cho sao chép. Có thể tải bản TXT hoặc CSV.');
    }
  };
  const indices = (group) => {
    if (variant === 0) return { headlines: group.preview_headlines, descriptions: group.preview_descriptions };
    const candidates = group.id === 'measurement'
      ? [[3, 5, 8], [2, 10, 7], [4, 6, 14], [3, 9, 12]]
      : [[3, 4, 8], [2, 6, 7], [1, 5, 14], [2, 9, 12]];
    return { headlines: candidates[(variant - 1) % candidates.length], descriptions: [variant % 4, (variant + 1) % 4] };
  };
  const currentCopy = () => {
    const selected = indices(selectedGroup);
    return [selected.headlines.map((index) => selectedGroup.headlines[index]).join(' | '), ...selected.descriptions.map((index) => selectedGroup.descriptions[index]), selectedGroup.final_url].join('\n');
  };
  function renderSearch() {
    const ad = byId('search-ad');
    ad.replaceChildren();
    const chosen = indices(selectedGroup);
    ad.append(node('div', 'ad-sponsored', 'Được tài trợ'));
    const brand = node('div', 'ad-brand');
    const brandImage = node('img');
    brandImage.src = kit.business.logo;
    brandImage.alt = '';
    const brandText = node('div', '', kit.business.name);
    brandText.append(node('small', '', `https://dtpt.shop › ${selectedGroup.display_paths.join(' › ')}`));
    brand.append(brandImage, brandText);
    ad.append(brand);
    const content = node('div', 'ad-main');
    const text = node('div');
    const headline = node('h3', 'ad-headline');
    headline.append(link(chosen.headlines.map((index) => selectedGroup.headlines[index]).join(' | '), selectedGroup.final_url));
    text.append(headline, node('p', 'ad-description', chosen.descriptions.map((index) => selectedGroup.descriptions[index]).join(' ')));
    const product = node('img', 'ad-product');
    product.src = selectedGroup.preview_image;
    product.alt = `${selectedGroup.product}, ảnh catalogue gốc`;
    content.append(text, product);
    ad.append(content, node('p', 'ad-callouts', kit.callouts.join(' · ')));
    const sitelinks = node('div', 'ad-sitelinks');
    kit.sitelinks.forEach((item) => {
      const block = node('div');
      block.append(link(item.text, item.url), node('p', '', `${item.description1}. ${item.description2}.`));
      sitelinks.append(block);
    });
    ad.append(sitelinks, link(`Gọi DTPT Techs: ${kit.business.phone_display}`, `tel:${kit.business.phone}`, 'ad-phone'));
  }
  function renderCopyTable(containerId, items, limit) {
    const table = node('table', 'copy-table');
    const head = node('thead');
    const heading = node('tr');
    [['#', 'index-col'], ['Nội dung', ''], ['Ký tự', 'count-col'], ['', 'action-col']].forEach(([text, className]) => heading.append(node('th', className, text)));
    head.append(heading);
    const body = node('tbody');
    items.forEach((text, index) => {
      const row = node('tr');
      row.append(node('td', 'index-col', String(index + 1)), node('td', '', text), node('td', 'count-col', `${[...text].length}/${limit}`));
      const action = node('td', 'action-col');
      const button = node('button', 'icon-button');
      button.setAttribute('aria-label', `Sao chép ${text}`);
      button.title = 'Sao chép nội dung';
      button.append(icon('copy'));
      button.addEventListener('click', () => copy(text));
      action.append(button);
      row.append(action);
      body.append(row);
    });
    table.append(head, body);
    byId(containerId).replaceChildren(table);
  }
  function renderCopy() {
    const destination = byId('copy-destination');
    destination.replaceChildren('Trang đích: ', link(selectedGroup.final_url, selectedGroup.final_url));
    renderCopyTable('headline-table', selectedGroup.headlines, kit.text_limits.headline);
    renderCopyTable('description-table', selectedGroup.descriptions, kit.text_limits.description);
    const keywords = byId('keyword-list');
    keywords.replaceChildren(...selectedGroup.keyword_seeds.map((text) => node('span', '', text)));
  }
  function setGroup(id) {
    selectedGroup = kit.ad_groups.find((group) => group.id === id) || kit.ad_groups[0];
    variant = 0;
    byId('preview-group').value = selectedGroup.id;
    byId('copy-group').value = selectedGroup.id;
    renderSearch();
    renderCopy();
  }
  function openImage(id) {
    const asset = kit.assets.find((item) => item.id === id);
    if (!asset) return;
    byId('dialog-title').textContent = asset.name;
    byId('dialog-image').src = asset.file;
    byId('dialog-image').alt = asset.name;
    byId('dialog-download').href = asset.file;
    byId('dialog-caption').textContent = `${asset.width} × ${asset.height} px · ${asset.ratio_label} · ${asset.usage}`;
    byId('image-dialog').showModal();
  }
  function renderImages(filter = 'all') {
    const grid = byId('image-grid');
    grid.replaceChildren();
    kit.assets.filter((asset) => filter === 'all' || asset.kind === filter).forEach((asset) => {
      const card = node('article', 'image-card');
      const open = node('button', 'image-open');
      open.setAttribute('aria-label', `Phóng to ${asset.name}`);
      const image = node('img');
      image.src = asset.file;
      image.alt = asset.name;
      image.loading = 'lazy';
      open.append(image);
      open.addEventListener('click', () => openImage(asset.id));
      const meta = node('div', 'image-meta');
      meta.append(node('p', 'asset-type', asset.origin === 'AI_CONCEPT' ? 'ẢNH DỰNG AI' : 'ẢNH GỐC'), node('h3', '', asset.name), node('p', '', asset.usage));
      const actions = node('div', 'image-actions');
      const download = node('a', 'icon-button');
      download.href = asset.file;
      download.download = '';
      download.title = 'Tải hình ảnh';
      download.setAttribute('aria-label', `Tải ${asset.name}`);
      download.append(icon('download'));
      actions.append(node('span', '', `${asset.width} × ${asset.height} · ${asset.ratio_label} · ${(asset.bytes / 1048576).toFixed(2)} MB`), download);
      meta.append(actions);
      card.append(open, meta);
      grid.append(card);
    });
  }
  function renderExtensions() {
    kit.sitelinks.forEach((item) => {
      const block = node('div', 'extension-item');
      block.append(link(item.text, item.url), node('p', '', `${item.description1}. ${item.description2}.`), node('small', '', item.url));
      byId('extension-list').append(block);
    });
    byId('callout-list').append(...kit.callouts.map((text) => node('span', '', text)));
  }
  function renderFiles() {
    const files = [
      ['dtpt-ads-review.pdf', 'Bản duyệt PDF, 3 trang', 'Banner, hai mẫu Search và toàn bộ tiêu đề/mô tả.'],
      ['dtpt-ads-kit.zip', 'Bộ tài liệu đầy đủ', 'Hình ảnh, nội dung và bản xem thử trong một gói ZIP.'],
      ['campaign.json', 'Cấu hình & nội dung chiến dịch', '2 nhóm quảng cáo, thông tin doanh nghiệp, liên kết và trạng thái.'],
      ['ad-copy.csv', '30 tiêu đề & 8 mô tả', 'Bảng duyệt nội dung, số ký tự; mở bằng Excel.'],
      ['extensions.csv', 'Liên kết phụ & thông tin mở rộng', '4 sitelink, callout, structured snippet và số điện thoại.'],
      ['keyword-seeds.csv', 'Từ khóa đề xuất', 'Từ khóa gợi ý và từ khóa phủ định cần duyệt.'],
      ['copy.txt', 'Bản nội dung văn bản', 'Nội dung tiếng Việt để đối chiếu hoặc sao chép.'],
      ['image-manifest.json', 'Danh mục hình ảnh', 'Kích thước thực tế, nguồn ảnh và phân loại gốc/AI.'],
      ['image-prompts.json', 'Prompt dựng hình', 'Prompt và đầu vào đã dùng qua imagegen tích hợp.'],
      ['README.md', 'Ghi chú sử dụng', 'Giới hạn nền tảng và các bước trước khi tạo quảng cáo.']
    ];
    files.forEach(([file, name, description]) => {
      const row = node('div', 'file-item');
      const label = node('div', 'file-name');
      const info = node('div');
      info.append(node('strong', '', name), node('p', '', description));
      label.append(icon('file'), info);
      const download = node('a', 'icon-button');
      download.href = file;
      download.download = '';
      download.title = `Tải ${file}`;
      download.setAttribute('aria-label', `Tải ${name}`);
      download.append(icon('download'));
      row.append(label, download);
      byId('file-list').append(row);
    });
    byId('pending-list').append(...kit.pending_before_creation.map((text) => node('li', '', text)));
    byId('source-list').append(...kit.sources.map((source) => link(source.title, source.url)));
  }
  function setTab(name, updateHash = true) {
    const valid = ['overview', 'images', 'copy', 'files'];
    if (!valid.includes(name)) name = 'overview';
    document.querySelectorAll('[data-tab]').forEach((button) => {
      const selected = button.dataset.tab === name;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    valid.forEach((view) => { byId(`view-${view}`).hidden = view !== name; });
    if (updateHash) history.replaceState(null, '', `#${name}`);
  }
  document.querySelectorAll('[data-icon]').forEach((element) => { element.innerHTML = icons[element.dataset.icon] || ''; });
  for (const id of ['preview-group', 'copy-group']) {
    const select = byId(id);
    kit.ad_groups.forEach((group) => {
      const option = node('option', '', group.name);
      option.value = group.id;
      select.append(option);
    });
    select.addEventListener('change', () => setGroup(select.value));
  }
  document.querySelectorAll('[data-tab]').forEach((button, index, buttons) => {
    button.addEventListener('click', () => setTab(button.dataset.tab));
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      setTab(buttons[next].dataset.tab);
      buttons[next].focus();
    });
  });
  document.querySelector('.tabs').setAttribute('role', 'tablist');
  document.querySelectorAll('[data-device]').forEach((button) => {
    if (button.tagName !== 'BUTTON') return;
    button.addEventListener('click', () => {
      byId('search-stage').dataset.device = button.dataset.device;
      document.querySelectorAll('button[data-device]').forEach((other) => {
        const selected = other === button;
        other.classList.toggle('selected', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
    });
  });
  document.querySelectorAll('[data-image]').forEach((button) => button.addEventListener('click', () => openImage(button.dataset.image)));
  byId('shuffle-ad').addEventListener('click', () => { variant = variant % 4 + 1; renderSearch(); });
  byId('copy-ad').addEventListener('click', () => copy(currentCopy()));
  byId('image-filter').addEventListener('change', (event) => renderImages(event.target.value));
  byId('dialog-close').addEventListener('click', () => byId('image-dialog').close());
  byId('image-dialog').addEventListener('click', (event) => {
    const dialog = byId('image-dialog');
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  addEventListener('hashchange', () => setTab(location.hash.slice(1), false));
  renderImages();
  renderExtensions();
  renderFiles();
  setGroup(selectedGroup.id);
  setTab(location.hash.slice(1) || 'overview', false);
})();
