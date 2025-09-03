const P = "data:image/svg+xml,%3csvg%20width='101'%20height='101'%20viewBox='0%200%20101%20101'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10.5208%2024.6667V16.8333C10.5208%2014.5091%2012.4049%2012.625%2014.7291%2012.625H39.9791L50.5%2025.25H86.2708C88.5951%2025.25%2090.4791%2027.1341%2090.4791%2029.4583V84.1667C90.4791%2086.4909%2088.5951%2088.375%2086.2708%2088.375H14.7291C12.4049%2088.375%2010.5208%2086.4909%2010.5208%2084.1667V78.5'%20stroke='%23818181'%20stroke-width='5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M3%2062.5V47.5H25.5V32.4142C25.5%2031.5233%2026.5771%2031.0771%2027.2071%2031.7071L50.2929%2054.7929C50.6834%2055.1834%2050.6834%2055.8166%2050.2929%2056.2071L27.2071%2079.2929C26.5771%2079.9229%2025.5%2079.4767%2025.5%2078.5858V62.5H3Z'%20fill='%23F1BA10'%20stroke='%233D3D3D'%20stroke-width='2'/%3e%3c/svg%3e", H = "data:image/svg+xml,%3csvg%20width='101'%20height='101'%20viewBox='0%200%20101%20101'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M90.4791%2032V29.4583C90.4791%2027.1341%2088.5951%2025.25%2086.2708%2025.25H50.5L39.9791%2012.625H14.7291C12.4049%2012.625%2010.5208%2014.5091%2010.5208%2016.8333V84.1667C10.5208%2086.4909%2012.4049%2088.375%2014.7291%2088.375H86.2708C88.5951%2088.375%2090.4791%2086.4909%2090.4791%2084.1667V79.5'%20stroke='%23818181'%20stroke-width='5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M51%2062.5V47.5H73.5V32.4142C73.5%2031.5233%2074.5771%2031.0771%2075.2071%2031.7071L98.2929%2054.7929C98.6834%2055.1834%2098.6834%2055.8166%2098.2929%2056.2071L75.2071%2079.2929C74.5771%2079.9229%2073.5%2079.4767%2073.5%2078.5858V62.5H51Z'%20fill='%230068D4'%20stroke='%233D3D3D'%20stroke-width='2'/%3e%3c/svg%3e", O = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2022.0.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version='1.1'%20id='图层_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%2054%2054'%20style='enable-background:new%200%200%2054%2054;'%20xml:space='preserve'%20width='100px'%20height='100px'%3e%3cstyle%20type='text/css'%3e%20.st0{fill:none;stroke:%23333333;stroke-miterlimit:10;}%20.st1{fill:%23F1BA10;stroke:%23333333;stroke-miterlimit:10;}%20.st2{fill:%231664B5;stroke:%23333333;stroke-miterlimit:10;}%20%3c/style%3e%3cg%3e%3cpolygon%20class='st0'%20points='47.4,46.6%206.1,46.6%206.6,7.4%2047.9,7.4%20'/%3e%3cg%3e%3cpolygon%20class='st1'%20points='26.4,27.8%2013.8,15.2%2013.8,24.3%202.5,24.3%202.5,31.3%2013.8,31.3%2013.8,40.4%20'/%3e%3cpolygon%20class='st2'%20points='51.5,27.8%2038.9,15.2%2038.9,24.3%2027.6,24.3%2027.6,31.3%2038.9,31.3%2038.9,40.4%20'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
var _ = Object.defineProperty, D = Object.getOwnPropertySymbols, U = Object.prototype.hasOwnProperty, W = Object.prototype.propertyIsEnumerable, B = (y, e, n) => e in y ? _(y, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : y[e] = n, V = (y, e) => {
  for (var n in e || (e = {}))
    U.call(e, n) && B(y, n, e[n]);
  if (D)
    for (var n of D(e))
      W.call(e, n) && B(y, n, e[n]);
  return y;
};
class j {
  constructor(e, n, t, i = {}) {
    this.connections = [], this.selectedNode = null, this.currentConnection = null, this.treeContainers = [], this.handleDocumentClick = (o) => {
      const r = document.getElementById("connection-delete-menu"), l = document.getElementById("connection-layer");
      r && o.target !== r && !r.contains(o.target) && !(l && l.contains(o.target) && o.target.tagName === "path") && this.removeDeleteMenu();
    }, this.enableLink = i.enableLink !== void 0 ? i.enableLink : !0, this.enableTxtBgColor = i.enableTxtBgColor !== void 0 ? i.enableTxtBgColor : !1, this.bezier = i.bezier !== void 0 ? i.bezier : 70, this.enableDraggable = i.enableDraggable !== !1, this.minTreeDistance = i.minTreeDistance !== void 0 ? i.minTreeDistance : 100, this.onConnectionsChange = i.onConnectionsChange, this.onConnectionChange = i.onConnectionChange, this.onUpdateConnection = i.onUpdateConnection, this.trees = Array.isArray(n) ? n : [], this.linkList = Array.isArray(t) ? t : [];
    const s = document.getElementById(e);
    if (!s)
      throw new Error(`Container with id "${e}" not found`);
    s.style.display = this.enableDraggable ? "block" : "flex", this.enableDraggable || (s.style.justifyContent = "space-around"), s.style.padding = "6px 10px", s.style.position = "relative", this.container = s, this.init();
  }
  init() {
    this.container.style.height || (this.container.style.minHeight = "500px"), this.container.innerHTML = '<svg id="connection-layer" width="100%" height="100%"></svg>';
    const e = document.getElementById("connection-layer");
    e && (e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.width = "100%", e.style.height = "100%", e.style.pointerEvents = "none", e.style.zIndex = "10"), window.addEventListener("resize", this.handleResize.bind(this)), new ResizeObserver(this.handleResize.bind(this)).observe(this.container), this.trees.forEach((t, i) => {
      const s = document.createElement("div");
      if (s.className = "tree-container", s.id = t.id, t.width ? s.style.width = `${t.width}px` : this.container.dataset.treewidth && (s.style.width = `${this.container.dataset.treewidth}`), t.height ? s.style.height = `${t.height}px` : this.container.dataset.treeheight && (s.style.height = `${this.container.dataset.treeheight}`), s.style.position = this.enableDraggable ? "absolute" : "relative", s.style.userSelect = "none", this.enableDraggable) {
        const l = (t.width || parseInt(this.container.dataset.treewidth || "0")) * i + i * this.minTreeDistance;
        s.style.left = `${l}px`, s.style.top = "20px";
      } else
        i < this.trees.length - 1 && (s.style.marginRight = `${this.minTreeDistance / 2}px`);
      const o = document.createElement("div");
      o.className = "tree-container-header", o.style.padding = "8px 12px", o.style.background = "#f5f7fa", o.style.borderBottom = "1px solid #e6e6e6", o.style.textAlign = "center", o.style.fontWeight = "bold", o.style.borderRadius = "4px 4px 0 0", o.textContent = t.id.charAt(0).toUpperCase() + t.id.slice(1), this.enableDraggable && (s.style.cursor = "grab", o.style.cursor = "grab"), s.appendChild(o), this.container.appendChild(s), this.treeContainers.push(s), this.enableDraggable && this.makeTreeContainerDraggable(s);
    }), this.initializeTrees(), window.addEventListener("resize", () => this.drawConnections());
  }
  /**
   * 使树容器可拖拽
   */
  makeTreeContainerDraggable(e) {
    e.style.position = "absolute", e.style.zIndex = "1", e.style.transform = "translateZ(0)", e.style.transition = "none";
    let n = !1, t = !1, i = 0, s = 0;
    e.wasDragging = t;
    const o = (a) => {
      if (a.button !== 0) return;
      n = !0, t = !1, e.wasDragging = t;
      const d = e.getBoundingClientRect();
      i = a.clientX - d.left, s = a.clientY - d.top, e.classList.add("dragging"), e.style.zIndex = "100", a.preventDefault();
    }, r = (a) => {
      if (!n) return;
      t = !0, e.wasDragging = t;
      const d = this.container.getBoundingClientRect();
      e.style.left = `${a.clientX - i - d.left}px`, e.style.top = `${a.clientY - s - d.top}px`, this.drawConnections();
    }, l = (a) => {
      n && (n = !1, e.classList.remove("dragging"), e.style.zIndex = "1", this.adjustContainerSize(), this.drawConnections(), setTimeout(() => {
        t = !1, e.wasDragging = t;
      }, 100));
    };
    e.addEventListener("mousedown", o), document.addEventListener("mousemove", r), document.addEventListener("mouseup", l), e.addEventListener("selectstart", (a) => (a.preventDefault(), !1));
    const u = () => {
      e.removeEventListener("mousedown", o), document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", l), e.removeEventListener("selectstart", () => !1);
    };
    e._dragCleanup = u;
  }
  getParentNode(e) {
    const n = document.querySelector(`[data-id="${e}"]`), t = n.getBoundingClientRect();
    return t.top !== 0 ? t : this.getParentNode(n.parentElement.parentElement.dataset.id);
  }
  renderTreeNode(e, n) {
    const t = document.createElement("div");
    let i = `tree-node level-${e.level}`;
    e.children && e.children.length > 0 && (i += " has-children"), e.level === 1 && (i += " level-1-node"), t.className = i, t.dataset.id = e.id, t.dataset.level = e.level.toString(), e.parentId && (t.dataset.parentId = e.parentId);
    const s = document.createElement("div");
    if (s.className = `tree-node-row level-${e.level}`, t.appendChild(s), e.children && e.children.length > 0) {
      const l = document.createElement("span");
      l.className = "tree-toggle minus", l.addEventListener("click", (u) => {
        u.stopPropagation();
        const a = t.querySelector(".tree-children");
        a.classList.toggle("active"), a.classList.contains("active") ? (l.classList.remove("plus"), l.classList.add("minus")) : (l.classList.remove("minus"), l.classList.add("plus")), this.drawConnections();
      }), s.appendChild(l);
    } else {
      const l = document.createElement("span");
      l.className = "no-toggle", l.style.width = "3px", l.style.display = "inline-block", l.style.marginRight = "5px", s.classList.add("not-children"), s.appendChild(l);
    }
    let o = "";
    switch (e.type) {
      case "input":
        o = P;
        break;
      case "output":
        o = H;
        break;
      case "inOut":
        o = O;
        break;
      default:
        o = e.icon || "";
    }
    if (o) {
      const l = document.createElement("img");
      l.src = o, l.className = "tree-icon", s.appendChild(l);
    }
    const r = document.createElement("span");
    if (r.className = "tree-label", this.enableTxtBgColor ? (r.className += " tree-bg-color", r.style.padding = "2px 10px") : r.className += " default", r.textContent = e.label, r.addEventListener("click", () => {
      this.handleNodeClick(e.id);
    }), s.appendChild(r), e.children && e.children.length > 0) {
      const l = document.createElement("div");
      l.className = "tree-children active", t.appendChild(l), e.children.forEach((u) => {
        u.parentId = e.id, this.renderTreeNode(u, l);
      });
    }
    n.appendChild(t);
  }
  handleNodeClick(e) {
    var n, t;
    const i = document.querySelector(`[data-id="${e}"]`), s = i?.closest(".tree-container");
    if (s && s.wasDragging)
      return;
    if (this.selectedNode) {
      const r = document.querySelector(
        `[data-id="${this.selectedNode}"] .tree-label`
      );
      r && r.classList.remove("selected");
    }
    if (this.selectedNode && this.selectedNode !== e) {
      const r = (n = document.querySelector(`[data-id="${this.selectedNode}"]`)) == null ? void 0 : n.closest(".tree-container"), l = (t = document.querySelector(`[data-id="${e}"]`)) == null ? void 0 : t.closest(".tree-container");
      if (this.enableLink && r && l && r.id !== l.id) {
        const u = this.selectedNode, a = e, d = `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, v = { source: u, target: a, id: d };
        this.connections.push(v), this.drawConnections(), this.onConnectionsChange && this.onConnectionsChange([...this.connections]), this.onConnectionChange && this.onConnectionChange(v, "add"), this.selectedNode = null;
        return;
      } else if (!this.enableLink) {
        this.selectedNode = e;
        const u = document.querySelector(
          `[data-id="${e}"] .tree-label`
        );
        u && u.classList.add("selected");
        return;
      }
    }
    if (this.selectedNode === e) {
      const r = document.querySelector(
        `[data-id="${e}"] .tree-label`
      );
      r && r.classList.remove("selected"), this.selectedNode = null;
      return;
    }
    this.selectedNode = e;
    const o = document.querySelector(
      `[data-id="${e}"] .tree-label`
    );
    o && o.classList.add("selected");
  }
  isNodeVisible(e) {
    const n = document.querySelector(`[data-id="${e}"]`);
    if (!n) return !1;
    let t = n.parentElement;
    for (; t && t.classList.contains("tree-children"); ) {
      if (!t.classList.contains("active"))
        return !1;
      t = t.parentElement && t.parentElement.parentElement ? t.parentElement.parentElement : null;
    }
    const i = n.closest(".tree-container");
    if (!i) return !1;
    const s = n.getBoundingClientRect(), o = i.getBoundingClientRect();
    return s.bottom > o.top && s.top < o.bottom;
  }
  findNearestVisibleAncestor(e) {
    const n = document.querySelector(`[data-id="${e}"]`);
    if (!n) return null;
    if (this.isNodeVisible(e))
      return e;
    let t = n.dataset.parentId;
    for (; t; ) {
      if (this.isNodeVisible(t))
        return t;
      const a = document.querySelector(`[data-id="${t}"]`);
      if (!a) break;
      t = a.dataset.parentId;
    }
    const i = n.dataset.level, s = Array.from(
      document.querySelectorAll(`.tree-node[data-level="${i}"]`)
    ), o = n.getBoundingClientRect(), r = s.filter((a) => this.isNodeVisible(a.dataset.id));
    if (r.length === 0) {
      const a = n.parentElement ? n.parentElement.closest(".tree-node") : null;
      return a ? this.findNearestVisibleAncestor(a.dataset.id) : null;
    }
    return r.sort((a, d) => {
      const v = a.getBoundingClientRect(), k = d.getBoundingClientRect();
      return Math.abs(v.top - o.top) - Math.abs(k.top - o.top);
    }), r[0].dataset.id;
  }
  addScrollListenersWithThrottle() {
    document.querySelectorAll(".tree-container").forEach((n) => {
      n.addEventListener("scroll", this.throttle(() => this.drawConnections(), 10));
    });
  }
  throttle(e, n) {
    let t = 0;
    return () => {
      const i = Date.now();
      i - t >= n && (t = i, e());
    };
  }
  getNodeVisibilityPosition(e) {
    const n = document.querySelector(`[data-id="${e}"]`), t = n ? n.querySelector(".tree-label") : null;
    if (!t)
      return "unknown";
    const i = t.closest(".tree-container");
    if (!i)
      return "unknown";
    const s = t.getBoundingClientRect(), o = i.getBoundingClientRect();
    let r = null;
    return s.top === 0 && (r = this.getParentNode(e)), s.top === 0 && r ? r.top < o.top ? "top" : r.bottom > o.bottom ? "bottom" : "visible" : s.top < o.top ? "top" : s.bottom > o.bottom ? "bottom" : "visible";
  }
  findFirstVisibleNode() {
    const e = document.querySelectorAll(".tree-node");
    for (const n of Array.from(e)) {
      const t = n.dataset.id;
      if (this.isNodeVisible(t))
        return n;
    }
    return null;
  }
  // 处理窗口和容器大小变化
  handleResize() {
    const e = document.getElementById("connection-layer");
    e && (e.style.width = "100%", e.style.height = "100%", e.setAttribute("width", "100%"), e.setAttribute("height", "100%")), this.drawConnections();
  }
  /**
   * 调整父容器大小以适应所有树容器
   * 在拖拽完成后调用，确保容器和SVG能够覆盖所有树的位置
   */
  adjustContainerSize() {
    if (!this.enableDraggable || !this.container) return;
    const e = this.treeContainers;
    if (e.length === 0) return;
    let n = 0, t = 0;
    e.forEach((u) => {
      const a = u.getBoundingClientRect();
      this.container.getBoundingClientRect();
      const d = parseInt(u.style.left || "0"), v = parseInt(u.style.top || "0"), k = a.width, C = a.height;
      n = Math.max(n, d + k), t = Math.max(t, v + C);
    });
    const i = window.getComputedStyle(this.container), s = parseInt(i.width), o = parseInt(i.height), r = parseInt(i.minHeight || "0");
    n > s && (this.container.style.width = `${n + 50}px`);
    const l = Math.max(t + 50, r);
    l > o && (this.container.style.minHeight = `${l}px`);
  }
  drawConnections() {
    const e = document.getElementById("connection-layer");
    if (!e) return;
    e.innerHTML = "", e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.width = "100%", e.style.height = "100%", e.style.pointerEvents = "none", e.style.zIndex = "10";
    const n = e.getBoundingClientRect();
    if (this.removeDeleteMenu(), this.connections.forEach((t) => {
      const i = document.querySelector(
        `[data-id="${t.source}"] .tree-label`
      ), s = document.querySelector(
        `[data-id="${t.target}"] .tree-label`
      );
      if (i && s) {
        const o = i.closest(".tree-container");
        if (!o) return;
        const r = s.closest(".tree-container");
        if (!r) return;
        const l = i.getBoundingClientRect(), u = s.getBoundingClientRect(), a = o.getBoundingClientRect(), d = r.getBoundingClientRect(), v = this.treeContainers.findIndex((p) => p.id === o.id), k = this.treeContainers.findIndex((p) => p.id === r.id), C = v < k, L = this.getNodeVisibilityPosition(t.source), N = this.getNodeVisibilityPosition(t.target);
        let E, b, x, f;
        if (this.isNodeVisible(t.source)) {
          const p = o.getBoundingClientRect();
          E = C ? p.right + 5 - n.left : p.left - 5 - n.left, b = l.top + l.height / 2 - n.top;
        } else {
          const p = document.querySelector(
            `[data-id="${t.source}"]`
          );
          let h = null, m = p.parentElement;
          for (; m && m.classList.contains("tree-children"); ) {
            if (!m.classList.contains("active")) {
              const w = m.parentElement.dataset.id;
              if (this.isNodeVisible(w)) {
                h = w;
                break;
              }
            }
            m = m.parentElement && m.parentElement.parentElement ? m.parentElement.parentElement : null;
          }
          if (h) {
            const w = document.querySelector(
              `[data-id="${h}"] .tree-label`
            ).getBoundingClientRect();
            E = C ? a.right + 5 - n.left : a.left - 5 - n.left, b = w.top + w.height / 2 - n.top;
          } else if (E = C ? a.right + 5 - n.left : a.left - 5 - n.left, L === "top")
            b = a.top - n.top;
          else if (L === "bottom")
            b = a.bottom - n.top;
          else {
            const g = this.findNearestVisibleAncestor(t.source);
            if (g) {
              const w = document.querySelector(
                `[data-id="${g}"] .tree-label`
              ).getBoundingClientRect();
              b = w.top + w.height / 2 - n.top;
            } else
              b = a.top + a.height / 2 - n.top;
          }
        }
        let $ = null;
        if (!this.isNodeVisible(t.source)) {
          let h = document.querySelector(`[data-id="${t.source}"]`).parentElement;
          for (; h && h.classList.contains("tree-children"); ) {
            if (!h.classList.contains("active")) {
              const g = h.parentElement.dataset.id;
              if (this.isNodeVisible(g)) {
                $ = g;
                break;
              }
            }
            h = h.parentElement && h.parentElement.parentElement ? h.parentElement.parentElement : null;
          }
        }
        L === "top" && !$ && (b = o.getBoundingClientRect().top - n.top);
        let A = null;
        if (this.isNodeVisible(t.target))
          x = C ? d.left - 3 - n.left : d.right + 10 - n.left, f = u.top + u.height / 2 - n.top;
        else {
          let h = document.querySelector(
            `[data-id="${t.target}"]`
          ).parentElement;
          for (; h && h.classList.contains("tree-children"); ) {
            if (!h.classList.contains("active")) {
              const g = h.parentElement.dataset.id;
              if (this.isNodeVisible(g)) {
                A = g;
                break;
              }
            }
            h = h.parentElement && h.parentElement.parentElement ? h.parentElement.parentElement : null;
          }
          if (A) {
            const g = document.querySelector(
              `[data-id="${A}"] .tree-label`
            ).getBoundingClientRect();
            x = C ? d.left - 5 - n.left : d.right + 5 - n.left, f = g.top + g.height / 2 - n.top;
          } else if (x = C ? d.left - 3 - n.left : d.right + 10 - n.left, N === "top")
            f = d.top - n.top;
          else if (N === "bottom")
            f = d.bottom - n.top;
          else {
            const m = this.findNearestVisibleAncestor(t.target);
            if (m) {
              const g = document.querySelector(
                `[data-id="${m}"] .tree-label`
              ).getBoundingClientRect();
              f = g.top + g.height / 2 - n.top;
            } else
              f = d.top + d.height / 2 - n.top;
          }
        }
        N === "top" && !A ? f = r.getBoundingClientRect().top - n.top : N === "bottom" && !A && (f = r.getBoundingClientRect().bottom - n.top);
        const c = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        let R;
        const S = this.bezier;
        C ? (R = `M ${E} ${b} C ${E + S} ${b}, ${x - S} ${f}, ${x} ${f}`, c.setAttribute("marker-end", "url(#arrowhead-end)")) : (R = `M ${E} ${b} C ${E - S} ${b}, ${x + S} ${f}, ${x} ${f}`, c.setAttribute("marker-end", "url(#arrowhead-start)")), c.setAttribute("d", R), C ? c.setAttribute("stroke", "#4096ff") : c.setAttribute("stroke", "#ff7a45");
        const T = this.isNodeVisible(t.source), I = this.isNodeVisible(t.target), M = L === "top", q = N === "top";
        c.setAttribute("stroke-width", "1.5"), c.setAttribute("fill", "none"), M || q || !T || !I ? c.setAttribute("stroke-dasharray", "5,5") : c.removeAttribute("stroke-dasharray");
        const z = c.getAttribute("stroke-width");
        c.style.pointerEvents = "auto", c.setAttribute("vector-effect", "non-scaling-stroke"), c.setAttribute("stroke-linecap", "round"), c.setAttribute("stroke-linejoin", "round"), c.addEventListener("mouseenter", () => {
          c.setAttribute("stroke-width", "2"), c.style.cursor = "pointer", c.setAttribute("stroke-opacity", "2");
        }), c.addEventListener("mouseleave", () => {
          c.setAttribute("stroke-width", z || "1.5"), c.style.cursor = "default", c.setAttribute("stroke-opacity", "1");
        }), c.addEventListener("contextmenu", (p) => {
          p.preventDefault(), this.currentConnection = t, this.showDeleteMenu(p.clientX, p.clientY);
        }), e.appendChild(c);
      }
    }), this.connections.length > 0 && !document.getElementById("arrowhead-end")) {
      const t = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      ), i = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      i.setAttribute("id", "arrowhead-end"), i.setAttribute("markerWidth", "10"), i.setAttribute("markerHeight", "7"), i.setAttribute("refX", "9"), i.setAttribute("refY", "3.5"), i.setAttribute("orient", "auto"), i.setAttribute("markerUnits", "userSpaceOnUse");
      const s = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      s.setAttribute("points", "0 0, 10 3.5, 0 7"), s.setAttribute("fill", "#4096ff"), i.appendChild(s);
      const o = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      o.setAttribute("id", "arrowhead-start"), o.setAttribute("markerWidth", "10"), o.setAttribute("markerHeight", "7"), o.setAttribute("refX", "1"), o.setAttribute("refY", "3.5"), o.setAttribute("orient", "auto"), o.setAttribute("markerUnits", "userSpaceOnUse");
      const r = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      r.setAttribute("points", "0 0, 10 3.5, 0 7"), r.setAttribute("fill", "#ff7a45"), o.appendChild(r), t.appendChild(i), t.appendChild(o), e.appendChild(t);
    }
  }
  // 初始化树
  initializeTrees() {
    this.treeContainers.forEach((e) => {
      e.innerHTML = "";
    }), this.trees.forEach((e) => {
      const n = document.getElementById(e.id);
      if (!n) return;
      (Array.isArray(e.data) ? e.data : []).forEach((i) => {
        this.renderTreeNode(i, n);
      });
    }), this.addScrollListenersWithThrottle(), this.connections = [...this.linkList], this.drawConnections(), this.onConnectionsChange && this.onConnectionsChange([...this.connections]);
  }
  redraw() {
    this.drawConnections();
  }
  updateData(e, n) {
    this.trees = Array.isArray(e) ? e : [], this.linkList = Array.isArray(n) ? n : [], this.connections = [...this.linkList], this.initializeTrees(), this.onConnectionsChange && this.onConnectionsChange([...this.connections]);
  }
  // 获取当前所有连接线
  getConnections() {
    return [...this.connections];
  }
  // 删除单个连接线
  removeConnection(e) {
    const n = this.connections.findIndex(
      (t) => t.id && t.id === e.id || t.source === e.source && t.target === e.target
    );
    if (n !== -1) {
      const t = this.connections[n];
      return this.connections.splice(n, 1), this.drawConnections(), this.onConnectionChange && this.onConnectionChange(t, "remove"), this.onConnectionsChange && this.onConnectionsChange([...this.connections]), !0;
    }
    return !1;
  }
  /**
   * 更新指定连接的数据
   * @param updatedConnection 更新后的连接对象，必须包含id以标识要更新的连接
   */
  updateConnection(e) {
    if (!e.id)
      return;
    const n = this.connections.findIndex((t) => t.id === e.id);
    if (n !== -1) {
      const t = this.connections[n];
      this.connections[n] = V(V({}, t), e), this.drawConnections(), this.onUpdateConnection && this.onUpdateConnection(this.connections[n]), this.onConnectionsChange && this.onConnectionsChange([...this.connections]);
    }
  }
  // 显示删除菜单
  showDeleteMenu(e, n) {
    this.removeDeleteMenu();
    const t = document.createElement("div");
    t.id = "connection-delete-menu", t.style.position = "fixed", t.style.left = `${e + 10}px`, t.style.top = `${n}px`, t.style.backgroundColor = "white", t.style.border = "1px solid #ddd", t.style.borderRadius = "4px", t.style.padding = "4px 0", t.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)", t.style.zIndex = "1000", t.style.fontSize = "12px";
    const i = document.createElement("button");
    i.innerText = "删除连线", i.style.border = "none", i.style.backgroundColor = "transparent", i.style.padding = "6px 12px", i.style.cursor = "pointer", i.style.textAlign = "left", i.style.color = "#666", i.addEventListener("mouseenter", () => {
      i.style.backgroundColor = "#f5f5f5", i.style.color = "#333";
    }), i.addEventListener("mouseleave", () => {
      i.style.backgroundColor = "transparent", i.style.color = "#666";
    }), i.addEventListener("click", () => {
      this.currentConnection && this.removeConnection(this.currentConnection), this.removeDeleteMenu();
    }), t.appendChild(i), document.body.appendChild(t), document.addEventListener("click", this.handleDocumentClick);
  }
  // 移除删除菜单
  removeDeleteMenu() {
    const e = document.getElementById("connection-delete-menu");
    e && document.body.removeChild(e), document.removeEventListener("click", this.handleDocumentClick);
  }
}
typeof window < "u" && (window.MappingTreeFlow = j);
export {
  j as default
};
