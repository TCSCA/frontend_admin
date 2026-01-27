import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type ModalMode = 'edit' | 'view' | 'save';

interface ModalActionsProps {
  showCloseOnly?: boolean;
  isEditing?: boolean;
  isLoading?: boolean;
  mode?: ModalMode;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  saveButtonText?: string;
  editButtonText?: string;
  closeButtonText?: string;
  cancelButtonText?: string;
  children?: ReactNode;
  formId?: string;
  isSaveDisabled?: boolean;
}

export function ModalActions({
  showCloseOnly = false,
  isEditing = false,
  isLoading = false,
  mode = 'edit',
  onClose,
  onEdit,
  onCancel = () => {},
  onSave = () => {},
  saveButtonText = "Guardar",
  editButtonText = "Editar",
  closeButtonText = "Cerrar",
  cancelButtonText = "Cancelar",
  children,
  formId,
  isSaveDisabled = false,
}: ModalActionsProps) {
  if (showCloseOnly) {
    return (
      <div className="flex justify-center gap-12">
        <Button
          size="sm"
          className="custom-cancel-btn inline-flex text-md"
          style={{ width: "auto", padding: "0.75rem 2rem" }}
          onClick={onClose}
          type="button"
        >
          {closeButtonText}
        </Button>
        {children}
      </div>
    );
  }

  if (mode === 'save') {
    return (
      <div className="flex justify-center gap-12">
        <Button
          size="sm"
          className="custom-cancel-btn inline-flex text-md"
          style={{ width: "auto", padding: "0.75rem 2rem" }}
          onClick={onClose}
          type="button"
        >
          {closeButtonText}
        </Button>
        <Button
          size="sm"
          type={formId ? "submit" : "button"}
          className="custom-login-btn inline-flex text-md"
          style={{ width: "auto", padding: "0.75rem 2rem" }}
          onClick={formId ? undefined : onSave}
          disabled={isLoading || isSaveDisabled}
          form={formId}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saveButtonText}
        </Button>
        {children}
      </div>
    );
  }

  if (mode === 'view' || !isEditing) {
    return (
      <div className="flex justify-center gap-12">
        <Button
          size="sm"
          className="custom-cancel-btn inline-flex text-md"
          style={{ width: "auto", padding: "0.75rem 2rem" }}
          onClick={onClose}
          type="button"
        >
          {closeButtonText}
        </Button>
        {onEdit && (
          <Button
            size="sm"
            className="custom-login-btn inline-flex text-md"
            style={{ width: "auto", padding: "0.75rem 2rem" }}
            onClick={onEdit}
            type="button"
          >
            {editButtonText}
          </Button>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-12">
      <Button
        size="sm"
        className="custom-cancel-btn inline-flex text-md"
        style={{ width: "auto", padding: "0.75rem 2rem" }}
        onClick={onCancel}
        type="button"
      >
        {cancelButtonText}
      </Button>
      <Button
        size="sm"
        type={formId ? "submit" : "button"}
        className="custom-login-btn inline-flex text-md"
        style={{ width: "auto", padding: "0.75rem 2rem" }}
        onClick={formId ? undefined : onSave}
        disabled={isLoading || isSaveDisabled}
        form={formId}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {saveButtonText}
      </Button>
      {children}
    </div>
  );
}
