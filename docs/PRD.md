# Glowboard Web 启动页

更新：2026-10-14

## 目标

为 Glowboard 提供可访问的品牌占位页、隐私政策和用户协议，并推送到独立仓库 `VonZen/Glowboard`。网站使用 GitHub Pages，沿用原生 App 已配置的 `/Glowboard/privacypolicy/` 和 `/Glowboard/termsofservice/` 地址。

## 本次范围

- 首页：现有 App 图标、Glowboard 名称、隐私政策、用户协议、联系邮箱与版权信息。
- 暂不制作营销内容、App 截图、功能介绍、价格表和下载按钮；不以未完成 UI 作为展示素材。
- 协议页：英语，参考 TingRadio 的规范与入口结构，按 Glowboard 当前代码独立编写。
- 隐私披露：本地作品和最近记录、麦克风本地实时分析、本地音乐导入、MP4/GIF 导出、仅添加照片权限、系统分享、PostHog 手动埋点、Apple/RevenueCat 购买与恢复、支持邮件和 GitHub Pages 托管。
- 用户协议：内容与音乐权利、公共显示与频闪安全、设备亮度/发热、Pro 权益验证、订阅/试用/取消/退款、本地数据与法定消费者权利。
- 页面在桌面和手机上可读，支持键盘、跳转目录和打印；关闭 JavaScript 后仍完整可用。
- 仅发布 `public/`，不复制原生工程、购买/埋点配置密钥或 TingRadio 的法务文本。

## 验收

三个主入口和 404 页面正常响应；协议互链和目录锚点有效；手机布局无横向溢出；部署地址与 App 配置一致。原生 App 不属于本次网页修改范围，不使用模拟器。
