# 首页素材与产品文案

更新：2026-10-15

全部美术来自原生工程 `/Users/vonzen/CodeX/LEDBanner`，没有重新生成、仿造产品截图或使用模拟器。网站复制现有 PNG 原稿，通过 CSS 缩放展示；原生 App 文件未修改。

| 网站文件 | 原生工程来源 |
| --- | --- |
| `app-icon.png` | `docs/design/appicon-ihu-2026-10-15/applied-previews/AppIconPuppy/Default.png`，当前已选第一版 I❤️U 小狗预览 |
| `mascot-cream.png` | `Resources/Assets.xcassets/PoseHugCream.imageset/PoseHugCream@3x.png` |
| `mascot-peach.png` | 对应 `PoseHugPeach@3x.png` |
| `mascot-star.png` | 对应 `PoseHugStar@3x.png` |
| `scene-concert.png` | `SceneSupport.imageset/SceneSupport@2x.png` |
| `scene-love.png` | `SceneLove.imageset/SceneLove@2x.png` |
| `scene-birthday.png` | `SceneBirthday.imageset/SceneBirthday@2x.png` |
| `scene-airport.png` | `SceneAirport.imageset/SceneAirport@2x.png` |
| `theme-cream.png`、`theme-peach.png`、`theme-star.png` | 对应 `ThemeCardCream / Peach / Star` 的 3x 原稿 |
| `pro-puppy.png` | `PoseProCream.imageset/PoseProCream@3x.png` |

首屏宠物和 Pro 宠物的透明灯牌内孔叠加网站自己的文字或 Canvas 效果；不是 App UI 截图。场景卡片只提供示例消息，示例不是用户作品或真实评价。

配色依据 `DesignSystem/AppTheme.swift` 的三套 AppPalette。英文主题名称为网站的易读展示名，不作为 App 数据键。输入与主题完全独立；网页状态仅存在当前页面内存，不读取或写入浏览器本地存储。

原生功能文案根据 `Core/Pro/LEDProFeatures.swift`、`Core/LEDRender/LEDSpec.swift`、`Features/Business/BusinessHomeView.swift`、`Core/Audio/LEDAudioEngine.swift`、`Features/Export/ExportSheet.swift` 核对。当前导出被定义为 Pro 功能，未照搬早期 PRD 中免费导出的描述；不宣传轮播、iCloud、相册图片背景等仅在草案中列出的能力。App Store 入口沿用运行配置 `id6822701782`，不在网页展示上线状态或发布时间。
