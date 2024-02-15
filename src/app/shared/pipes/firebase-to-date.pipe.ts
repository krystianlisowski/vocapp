import { Pipe, type PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import dayjs from 'dayjs';

@Pipe({
  name: 'firebaseToDate',
  standalone: true,
})
export class FirebaseToDatePipe implements PipeTransform {
  transform(timestamp: Timestamp | undefined): string {
    return dayjs(timestamp?.toDate()).format('DD/MM/YYYY');
  }
}
