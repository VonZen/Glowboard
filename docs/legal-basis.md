# 法务文案与代码核对

核对日期：2026-10-14。文案依据同目录下 LEDBanner（对外品牌 Glowboard）的当前源代码；TingRadio 仅用来确认开发者、支持邮箱、GitHub Pages 入口约定及英语法务页的形式，未复用其协议正文。

## 当前实现

| 页面披露 | 核对的原生代码 | 结论 |
| --- | --- | --- |
| 本地作品、最近记录、草稿与偏好 | `Core/Banners/BannerStore.swift`、`RecentStore.swift`、`Core/AppPreferences.swift` | 作品 JSON 与偏好在设备本地，无 App 云账号或作品同步 |
| 麦克风 | `Core/Audio/LEDAudioEngine.swift`、`Features/Editor/EditorSoundPreview.swift` | 主动启动声控时申请权限，内存实时分析、不录音、不上传 |
| 音乐 | `Core/Audio/LEDMusicLibrary.swift` | 用户通过文件选择器选取，复制到 App 本地；导入副本排除备份，可删除 |
| 导出与相册 | `Core/Export/LEDExporter.swift`、`Features/Export/ExportModel.swift`、`ExportSheet.swift` | 本地 MP4/GIF；MP4 可混入音乐；麦克风不导出；仅申请相册 addOnly 权限；完成临时文件随导出面板关闭删除 |
| 统计 | `Core/Analytics/Analytics.swift`、`AnalyticsEvent.swift` | 自建 HTTPS batch 请求至 PostHog US；持久随机安装标识、时间、版本、系统语言/地区和明列事件；无用户文本、文件名、音频、session replay；关闭 person profile 与 GeoIP enrichment；当前无统计退出开关 |
| 购买 | `Core/Purchases/RevenueCatPurchaseService.swift`、`PremiumStore.swift`、`App/LEDBannerApp.swift` | 启动检查权限时可能联网；RevenueCat 自动生成标识；仅经过验证的真实有效权益解锁；不写死价格或试用资格 |
| 联系开发者 | `Core/AppDiagnostics.swift`、`Features/Settings/SettingsView.swift` | 打开可编辑邮件草稿，附版本/build/OS/机型/语言；不自动发送 |
| 显示安全 | `Features/Player/PlaybackEnvironment.swift`、`Features/Editor/EditorTabContent.swift` | 全屏改变亮度/锁屏状态，退出恢复；协议不声称闪烁对所有人安全 |
| 图标 | `Resources/Assets.xcassets/AppIconPreview.imageset/Default.png` | 复制现有正式默认图标；无生成图片或 UI 截图 |

## 与需求草案的区别

不把 PRD 中尚未实现的图片背景读取、轮播、通知、iCloud 同步、AI 生成、Apple Watch 等写成现有功能。音乐导出由当前代码决定，未照搬早期 PRD 的“不含音轨”描述。原生 PRD 的“隐私标签只申报购买记录和诊断数据”与当前 PostHog 功能使用统计不一致；上架时应按真实数据流复核 App Store 隐私披露。本文不修改原生工程或代替其 App Store 配置。

服务端保留期限、服务商协议及任何依法需要的统计同意机制，应在上架前由开发者结合实际服务设置确认；网页没有虚构精确保留天数、退出开关、数据本地化或已实施的合规措施。

## 核对的官方参考

- [RevenueCat：Apple App Privacy](https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy) 与 [隐私政策](https://www.revenuecat.com/privacy)：购买历史、权益与自动生成标识。
- [PostHog 隐私政策](https://posthog.com/privacy)：服务商处理；实际上传范围以当前自建事件发送器为准，而非 PostHog SDK 默认行为。
- [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)：托管请求和连接信息。
- [Apple：取消订阅](https://support.apple.com/en-us/118428)、[退款](https://support.apple.com/en-us/118223)、[标准 EULA](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/) 与 [App Analytics](https://www.apple.com/legal/privacy/data/en/app-analytics/)。
- 音乐具体来源和限制参见原生工程 `docs/third-party/music.md`；网页不承诺导入或内置音乐在任何场景均可任意商用。
