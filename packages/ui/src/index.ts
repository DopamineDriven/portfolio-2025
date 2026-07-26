import "./globals.css";
import type { Properties } from "csstype";

export { BaseAspectRatio } from "@/base/aspect-ratio";
export type { BaseAspectRatioProps } from "@/base/aspect-ratio";
export { BaseBadge, baseBadgeVariants } from "@/base/badge";
export { BaseButton, baseButtonVariants } from "@/base/button";
export {
  BaseCommand,
  BaseCommandDialog,
  BaseCommandInput,
  BaseCommandList,
  BaseCommandEmpty,
  BaseCommandGroup,
  BaseCommandItem,
  BaseCommandShortcut,
  BaseCommandSeparator
} from "@/base/command";
export {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogOverlay,
  BaseDialogPortal,
  BaseDialogTitle,
  BaseDialogTrigger
} from "@/base/dialog";
export {
  BaseDropdown,
  BaseDropdownPortal,
  BaseDropdownTrigger,
  BaseDropdownContent,
  BaseDropdownGroup,
  BaseDropdownLabel,
  BaseDropdownItem,
  BaseDropdownCheckboxItem,
  BaseDropdownRadioGroup,
  BaseDropdownRadioItem,
  BaseDropdownSeparator,
  BaseDropdownShortcut,
  BaseDropdownSub,
  BaseDropdownSubTrigger,
  BaseDropdownSubContent
} from "@/base/dropdown";
export { BaseInput } from "@/base/input";
export {
  BaseInputGroup,
  BaseInputGroupAddon,
  BaseInputGroupButton,
  BaseInputGroupText,
  BaseInputGroupInput,
  BaseInputGroupTextarea,
  baseInputGroupAddonVariants,
  baseInputGroupButtonVariants
} from "@/base/input-group";
export { BaseKbd, BaseKbdGroup } from "@/base/kbd";
export {
  BasePopover,
  BasePopoverContent,
  BasePopoverDescription,
  BasePopoverHeader,
  BasePopoverTitle,
  BasePopoverTrigger
} from "@/base/popover";
export {
  BaseProgress,
  BaseProgressTrack,
  BaseProgressIndicator,
  BaseProgressLabel,
  BaseProgressValue
} from "@/base/progress";
export { BaseScrollArea, BaseScrollBar } from "@/base/scroll";
export {
  BaseSelect,
  BaseSelectContent,
  BaseSelectGroup,
  BaseSelectItem,
  BaseSelectLabel,
  BaseSelectScrollDownButton,
  BaseSelectScrollUpButton,
  BaseSelectSeparator,
  BaseSelectTrigger,
  BaseSelectValue
} from "@/base/select";
export { BaseSeparator } from "@/base/separator";
export {
  BaseSheet,
  BaseSheetTrigger,
  BaseSheetClose,
  BaseSheetContent,
  BaseSheetHeader,
  BaseSheetFooter,
  BaseSheetTitle,
  BaseSheetDescription
} from "@/base/sheet";
export {
  BaseTable,
  BaseTableHeader,
  BaseTableBody,
  BaseTableFooter,
  BaseTableHead,
  BaseTableRow,
  BaseTableCell,
  BaseTableCaption
} from "@/base/table";
export { BaseTextarea } from "@/base/textarea";
export { BaseToggle, baseToggleVariants } from "@/base/toggle";
export {
  BaseToggleGroup,
  BaseToggleGroupContext,
  BaseToggleGroupItem
} from "@/base/toggle-group";
export {
  BaseTooltip,
  BaseTooltipTrigger,
  BaseTooltipContent,
  BaseTooltipProvider
} from "@/base/tooltip";
export { UploadProgress } from "@/base/upload-progress";

export { useAspectCh } from "@/hooks/use-aspect-ch";
export { useElementDimensions } from "@/hooks/use-element-dimensions";
export { useFallingEdgeTimer } from "@/hooks/use-falling-edge-timer";
export type { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";
export {
  formatShortcut,
  useKeyboardShortcuts
} from "@/hooks/use-keyboard-shortcuts";
export { useLocalStorageState } from "@/hooks/use-local-storage-state";
export { useMediaQuery } from "@/hooks/use-media-query";
export { useResizeObserver } from "@/hooks/use-resize-observer";
export { useResolvedTheme } from "@/hooks/use-resolved-theme";
export { useScrollObserver } from "@/hooks/use-scroll-observer";
export { useStateDeferred } from "@/hooks/use-state-deferred";
export { useViewportDimensions } from "@/hooks/use-viewport-dimensions";

export { Icon } from "@/icons/index";
export type { BaseSVGProps, IconName } from "@/icons/index";
export { AICoalesce } from "@/icons/aicoalesce";
export { AnonymousIcon } from "@/icons/anonymous";
export { AnthropicIcon } from "@/icons/anthropic";
export { ArrowDownCircle } from "@/icons/arrow-down-circle";
export { ArrowLeft } from "@/icons/arrow-left";
export { ArrowRight } from "@/icons/arrow-right";
export { BookOpen } from "@/icons/book-open";
export { Bot } from "@/icons/bot";
export { Camera } from "@/icons/camera";
export { Check } from "@/icons/check";
export { ChevronDown } from "@/icons/chevron-down";
export { ChevronRight } from "@/icons/chevron-right";
export { ChevronUp } from "@/icons/chevron-up";
export { CirclePlus } from "@/icons/circle-plus";
export { Circle } from "@/icons/circle";
export { ClaudeIcon } from "@/icons/claude";
export { Code } from "@/icons/code";
export { CohereIcon, CohereIconCurrentColor } from "@/icons/cohere";
export { Compass } from "@/icons/compass";
export { Copy } from "@/icons/copy";
export { DeepSeek } from "@/icons/deepseek";
export { Download } from "@/icons/download";
export { Edit } from "@/icons/edit";
export { EditIcon } from "@/icons/edit-icon";
export { EllipsisHorizontal } from "@/icons/ellipsis-horizontal";
export { EmptyChatHistory } from "@/icons/empty-chat-history";
export { Expand } from "@/icons/expand";
export { EyeClosed } from "@/icons/eye-closed";
export { EyeOff } from "@/icons/eye-off";
export { Eye } from "@/icons/eye";
export { FileText } from "@/icons/file-text";
export { Folder } from "@/icons/folder";
export { GeminiIcon } from "@/icons/gemini";
export { Github } from "@/icons/github";
export { GoogleIcon } from "@/icons/google";
export { GripVertical } from "@/icons/grip-vertical";
export { History } from "@/icons/history";
export { ImageGen } from "@/icons/image-gen";
export { ImageIcon } from "@/icons/image-icon";
export { KeyRound } from "@/icons/key-round";
export { Key } from "@/icons/key";
export { Kimi } from "@/icons/kimi";
export { Layers } from "@/icons/layers";
export { LoaderCircle } from "@/icons/loader-circle";
export { LoaderPinwheel } from "@/icons/loader-pinwheel";
export { Loader } from "@/icons/loader";
export { LogOut } from "@/icons/log-out";
export { Mail } from "@/icons/mail";
export { Menu } from "@/icons/menu";
export { MessageCircleQuestion } from "@/icons/message-circle-question";
export { MessageSquare } from "@/icons/message-square";
export { MessageSquareText } from "@/icons/message-square-text";
export { MetaIcon } from "@/icons/meta";
export { Mic } from "@/icons/mic";
export { MinimaxIcon } from "@/icons/minimax";
export { MistralIcon } from "@/icons/mistral";
export { Moon } from "@/icons/moon";
export { OpenAiIcon } from "@/icons/openai";
export { Package } from "@/icons/package";
export { Palette } from "@/icons/palette";
export { PanelLeft } from "@/icons/panel-left";
export { PanelLeftClose } from "@/icons/panel-left-close";
export { PanelRightClose } from "@/icons/panel-right-close";
export { Paperclip } from "@/icons/paperclip";
export { Pause } from "@/icons/pause";
export { PenLine } from "@/icons/pen-line";
export { Play } from "@/icons/play";
export { Plus } from "@/icons/plus";
export { QuestionMark } from "@/icons/question-mark";
export { QuoteIcon } from "@/icons/quote";
export { QwenIcon } from "@/icons/qwen";
export { ReadAloud } from "@/icons/read-aloud";
export { RetryIcon } from "@/icons/retry";
export { SakanaIcon } from "@/icons/sakana";
export { Save } from "@/icons/save";
export { Search } from "@/icons/search";
export { Send } from "@/icons/send";
export { SendMessage } from "@/icons/send-message";
export { Settings } from "@/icons/settings";
export { ShareIcon } from "@/icons/share-icon";
export { Sparkles } from "@/icons/sparkles";
export { SquarePen } from "@/icons/square-pen";
export { Stop } from "@/icons/stop";
export { Sun } from "@/icons/sun";
export { Terminal } from "@/icons/terminal";
export { ThumbsDown } from "@/icons/thumbs-down";
export { ThumbsUp } from "@/icons/thumbs-up";
export { Tools } from "@/icons/tools";
export { Trash } from "@/icons/trash";
export { TrashSimple } from "@/icons/trash-simple";
export { User } from "@/icons/user";
export { VercelIcon } from "@/icons/vercel";
export { X } from "@/icons/x";
export { XAiIcon } from "@/icons/xai";
export { Zai } from "@/icons/zai";
export { Zap } from "@/icons/zap";

export { mathmlTags } from "@/lib/mathml-tags";
export type {
  InferStrip,
  StripCommas,
  StripSeparators,
  StripUnderscore
} from "@/lib/safe-number";
export { isDecimal, n, stripSeparators, toN } from "@/lib/safe-number";
export type { ScaledRatio } from "@/lib/scale-ratio";
export {
  gcd,
  parseAndScaleRatio,
  parseRatio,
  scaleRatio
} from "@/lib/scale-ratio";
export type { SafeNumber } from "@/lib/shimmer";
export { fromBase64, shimmer, shimmerScaffold, toBase64 } from "@/lib/shimmer";
export { cn } from "@/lib/utils";

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/ui/accordion";
export type { AccordionProps } from "@/ui/accordion";
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/ui/alert-dialog";
export type { AlertDialogProps } from "@/ui/alert-dialog";
export { AspectRatio } from "@/ui/aspect-ratio";
export { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
export type { AvatarProps } from "@/ui/avatar";
export { Badge, badgeVariants } from "@/ui/badge";
export type { BadgeProps } from "@/ui/badge";
export { BreakoutWrapper } from "@/ui/breakout-wrapper";
export { Button, buttonVariants } from "@/ui/button";
export type { ButtonProps } from "@/ui/button";
export { ButtonDos, buttonDosVariants } from "@/ui/button-dos";
export type { ButtonDosProps } from "@/ui/button-dos";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
} from "@/ui/card";
export { Checkbox } from "@/ui/checkbox";
export type { CodeBlockProps } from "@/ui/code-block";
export { CodeBlock } from "@/ui/code-block";
export type { CopyButtonProps } from "@/ui/copy-button";
export { CopyButton } from "@/ui/copy-button";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/ui/dialog";
export type { DialogProps } from "@/ui/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from "@/ui/dropdown-menu";
export type { DropdownMenuProps } from "@/ui/dropdown-menu";
export { Input } from "@/ui/input";
export type { InputProps } from "@/ui/input";
export { Label } from "@/ui/label";
export { NativeTruncatedText } from "@/ui/native-truncated-text";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor
} from "@/ui/popover";
export type { PopoverProps } from "@/ui/popover";
export { Progress } from "@/ui/progress";
export type { ProgressProps } from "@/ui/progress";
export { ScrollArea, ScrollBar } from "@/ui/scroll-area";
export type { ScrollAreaProps } from "@/ui/scroll-area";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from "@/ui/select";
export type { SelectProps } from "@/ui/select";
export { Separator } from "@/ui/separator";
export type { SeparatorProps } from "@/ui/separator";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/ui/sheet";
export { Skeleton } from "@/ui/skeleton";
export { Slider } from "@/ui/slider";
export { Switch } from "@/ui/switch";
export type { SwitchProps } from "@/ui/switch";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
export type { TabsProps } from "@/ui/tabs";
export { Textarea } from "@/ui/textarea";
export type { TextareaProps } from "@/ui/textarea";
export { Toggle, toggleVariants } from "@/ui/toggle";
export type { ToggleProps } from "@/ui/toggle";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/ui/tooltip";

declare global {
  interface JSON {
    parse<T = unknown>(
      text: string,
      reviver?: (this: any, key: string, value: any) => any
    ): T;
  }
  interface Body {
    json<T = unknown>(): Promise<T>;
  }
}
declare module "react" {
  export interface CSSProperties extends Properties<string | number> {
    "--gap"?: number;
    "--ratio"?: number;
    "--skeleton-width"?: string;
    "--sidebar-width"?: string;
    "--sidebar-width-icon"?: string;
  }
}
