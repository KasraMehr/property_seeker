import { useState } from "react";
import { Trash2, UserPlus, Archive, Info, FileText, CheckCircle2 } from "lucide-react";

import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/modal/Modal";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import ThemeToggle from "../shared/ThemeToggle";

export default function ModalShowcase() {
  // Base Modal states
  const [baseModal, setBaseModal] = useState({ open: false, size: "md" });
  const [formModal, setFormModal] = useState(false);
  const [scrollModal, setScrollModal] = useState(false);

  // ConfirmModal states
  const [confirm, setConfirm] = useState({ open: false, variant: "danger" });
  const [configConfirm, setConfigConfirm] = useState({ open: false, type: "" });

  const openBase = (size) => setBaseModal({ open: true, size });
  const openConfirm = (variant) => setConfirm({ open: true, variant });
  const openConfig = (type) => setConfigConfirm({ open: true, type });

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <ThemeToggle/>

      {/* Section: Base Modal Sizes */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Base Modal — Sizes</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => openBase("sm")}>Small</Button>
          <Button variant="outline" size="sm" onClick={() => openBase("md")}>Medium</Button>
          <Button variant="outline" size="sm" onClick={() => openBase("lg")}>Large</Button>
          <Button variant="outline" size="sm" onClick={() => openBase("xl")}>Extra Large</Button>
        </div>
      </section>

      {/* Section: ConfirmModal Variants */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">ConfirmModal — Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" size="sm" onClick={() => openConfirm("danger")}>
            <Trash2 size={14} className="ml-1.5" />
            Danger
          </Button>
          <Button variant="primary" size="sm" onClick={() => openConfirm("warning")}>
            <Archive size={14} className="ml-1.5" />
            Warning
          </Button>
          <Button variant="primary" size="sm" onClick={() => openConfirm("info")}>
            <Info size={14} className="ml-1.5" />
            Info
          </Button>
          <Button variant="primary" size="sm" onClick={() => openConfirm("success")}>
            <CheckCircle2 size={14} className="ml-1.5" />
            Success
          </Button>
        </div>
      </section>

      {/* Section: Config-Driven */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">ConfirmModal — Config-Driven (type)</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" size="sm" onClick={() => openConfig("deleteLead")}>
            deleteLead
          </Button>
          <Button variant="primary" size="sm" onClick={() => openConfig("convertLead")}>
            convertLead
          </Button>
          <Button variant="outline" size="sm" onClick={() => openConfig("archiveProperty")}>
            archiveProperty
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openConfig("logout")}>
            logout
          </Button>
        </div>
      </section>

      {/* Section: Modal with Footer (Form) */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Modal with Footer — Form Pattern</h2>
        <Button variant="primary" size="sm" onClick={() => setFormModal(true)}>
          <FileText size={14} className="ml-1.5" />
          Open Form Modal
        </Button>
      </section>

      {/* Section: Scrollable Content */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Modal — Scrollable Content</h2>
        <Button variant="outline" size="sm" onClick={() => setScrollModal(true)}>
          Open Scrollable
        </Button>
      </section>

      {/* ============ MODALS ============ */}

      {/* Base Modal */}
      <Modal
        isOpen={baseModal.open}
        onClose={() => setBaseModal({ open: false, size: "md" })}
        title={`Size: ${baseModal.size}`}
        size={baseModal.size}
      >
        <p className="text-muted text-sm leading-relaxed">
          این یک مودال پایه با سایز {baseModal.size} است. از این کامپوننت برای نمایش فرم‌ها، جزئیات و محتوای عمومی استفاده می‌شود.
        </p>
      </Modal>

      {/* ConfirmModal — Manual */}
      <ConfirmModal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, variant: "danger" })}
        onConfirm={() => setConfirm({ open: false, variant: "danger" })}
        variant={confirm.variant}
        title={
          confirm.variant === "danger" ? "حذف آیتم" :
          confirm.variant === "warning" ? "هشدار" :
          confirm.variant === "info" ? "اطلاعات" : "موفق"
        }
        message={
          confirm.variant === "danger" ? "این عملیات قابل بازگشت نیست. آیا ادامه می‌دهید؟" :
          confirm.variant === "warning" ? "تغییرات ذخیره نشده‌اند. آیا مطمئنید؟" :
          confirm.variant === "info" ? "لطفاً اطلاعات خود را بررسی کنید." :
          "عملیات با موفقیت انجام شد."
        }
      />

      {/* ConfirmModal — Config-Driven */}
      <ConfirmModal
        isOpen={configConfirm.open}
        onClose={() => setConfigConfirm({ open: false, type: "" })}
        onConfirm={() => setConfigConfirm({ open: false, type: "" })}
        type={configConfirm.type}
        data={
          configConfirm.type === "deleteLead" ? { name: "علی احمدی" } :
          configConfirm.type === "convertLead" ? { name: "سارا رضایی" } :
          configConfirm.type === "archiveProperty" ? { title: "آپارتمان عظیمیه" } : {}
        }
      />

      {/* Form Modal */}
      <Modal
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        title="لید جدید"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setFormModal(false)}>انصراف</Button>
            <Button variant="primary" size="sm">ذخیره لید</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">نام</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-(--role-primary) focus:ring-1 focus:ring-(--role-primary)/20" placeholder="نام لید را وارد کنید" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">شماره تماس</label>
            <input type="tel" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-(--role-primary) focus:ring-1 focus:ring-(--role-primary)/20" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">توضیحات</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-(--role-primary) focus:ring-1 focus:ring-(--role-primary)/20 resize-none" placeholder="توضیحات اختیاری..." />
          </div>
        </div>
      </Modal>

      {/* Scrollable Modal */}
      <Modal
        isOpen={scrollModal}
        onClose={() => setScrollModal(false)}
        title="شرایط و مقررات"
        size="md"
      >
        <div className="space-y-4 text-sm text-muted leading-relaxed">
          <p>۱. استفاده از این سامانه منوط به پذیرش کلیه قوانین و مقررات می‌باشد.</p>
          <p>۲. کلیه اطلاعات وارد شده توسط کاربران محرمانه تلقی شده و در اختیار اشخاص ثالث قرار نمی‌گیرد.</p>
          <p>۳. مسئولیت صحت اطلاعات وارد شده بر عهده کاربر است و سامانه هیچ‌گونه مسئولیتی در قبال اطلاعات نادرست ندارد.</p>
          <p>۴. هرگونه سوءاستفاده از حساب کاربری، منجر به مسدودسازی دائمی خواهد شد.</p>
          <p>۵. سامانه حق تغییر در قوانین و شرایط استفاده را در هر زمان برای خود محفوظ می‌دارد.</p>
          <p>۶. پشتیبانی فنی در ساعات کاری از طریق تیکت و تماس تلفنی انجام می‌شود.</p>
          <p>۷. پرداخت‌ها از طریق درگاه‌های امن بانکی صورت می‌پذیرد و رسید پرداخت به ایمیل کاربر ارسال می‌شود.</p>
          <p>۸. در صورت بروز اختلال فنی، سامانه تعهد می‌کند در اسرع وقت نسبت به رفع مشکل اقدام نماید.</p>
          <p>۹. کاربر متعهد می‌شود از افشای رمز عبور خودداری کرده و در صورت مشاهده تخلف، سریعاً اطلاع‌رسانی نماید.</p>
          <p>۱۰. کلیه حقوق مادی و معنوی این سامانه متعلق به شرکت ملک‌جو می‌باشد.</p>
        </div>
      </Modal>

    </div>
  );
}