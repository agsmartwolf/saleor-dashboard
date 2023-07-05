import { getDefaultByControlName } from "../controlsType";
import { ConditionItem } from "./ConditionOptions";

export interface ItemOption {
  label: string;
  value: string;
  slug: string;
}

export type ConditionValue =
  | ItemOption
  | ItemOption[]
  | string
  | string[]
  | [string, string];


export class ConditionSelected {
  private constructor(
    public value: ConditionValue,
    public conditionValue: ConditionItem | null,
    public options: ConditionValue[],
    public loading: boolean,
  ) {}

  public static empty() {
    return new ConditionSelected("", null, [], false);
  }

  public static fromConditionItem(conditionItem: ConditionItem) {
    return new ConditionSelected(
      getDefaultByControlName(conditionItem.type),
      conditionItem,
      [],
      false,
    );
  }

  public static fromConditionItemAndValue(
    conditionItem: ConditionItem,
    value: ConditionValue,
  ) {
    return new ConditionSelected(value, conditionItem, [], false);
  }

  public enableLoading() {
    this.loading = true;
  }

  public disableLoading() {
    this.loading = false;
  }

  public isLoading() {
    return this.loading;
  }

  public setValue(value: ConditionValue) {
    this.value = value;
  }

  public setOptions(options: ConditionValue[]) {
    this.options = options;
  }
}
