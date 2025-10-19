import {HttpContextToken} from "@angular/common/http";

export const RETRIED_ONCE = new HttpContextToken<boolean>(() => false);