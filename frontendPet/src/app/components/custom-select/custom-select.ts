// import {
//   Component,
//   Input,
//   Output,
//   EventEmitter,
//   forwardRef,
//   HostListener,
//   ElementRef,
// } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { NgFor } from '@angular/common';

// export interface SelectOption {
//   value: string;
//   label: string;
// }

// @Component({
//   selector: 'app-custom-select',
//   standalone: true,
//   imports: [NgFor],
//   templateUrl: './custom-select.html',
//   styleUrl: './custom-select.css',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => CustomSelectComponent),
//       multi: true,
//     },
//   ],
// })
// export class CustomSelectComponent implements ControlValueAccessor {
//   @Input() options: SelectOption[] = [];
//   @Input() placeholder: string = 'Seleccionar...';
//   @Output() valueChange = new EventEmitter<string>();

//   isOpen = false;
//   selectedValue = '';
//   disabled = false;

//   // ControlValueAccessor
//   private onChange: (value: string) => void = () => {};
//   private onTouched: () => void = () => {};

//   constructor(private elementRef: ElementRef) {}

//   get selectedLabel(): string {
//     const option = this.options.find((opt) => opt.value === this.selectedValue);
//     return option ? option.label : this.placeholder;
//   }

//   toggleDropdown(): void {
//     if (!this.disabled) {
//       this.isOpen = !this.isOpen;
//     }
//   }

//   selectOption(option: SelectOption): void {
//     this.selectedValue = option.value;
//     this.isOpen = false;
//     this.onChange(this.selectedValue);
//     this.valueChange.emit(this.selectedValue);
//   }

//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: MouseEvent): void {
//     if (!this.elementRef.nativeElement.contains(event.target)) {
//       this.isOpen = false;
//     }
//   }

//   // ControlValueAccessor implementation
//   writeValue(value: string): void {
//     this.selectedValue = value || '';
//   }

//   registerOnChange(fn: (value: string) => void): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: () => void): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.disabled = isDisabled;
//   }
// }
