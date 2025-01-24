import { Component, OnInit } from '@angular/core';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: ['./session-timer.component.scss']
})
export class SessionTimerComponent implements OnInit {
  tokenTimer: any;
  constructor(private tokenStore:TokenStoreService ){

  }
  ngOnInit(): void {
    let exptime = this.tokenStore.getTokenExpirationTime() || 0
    debugger
    this.tokenStore.startTimer(exptime)

    this.tokenStore.formatTime().subscribe((time: any) => {
     this.tokenTimer = time

    })
  }

  isTokenTimerValid(): boolean {
    // return true
    // if (this.tokenTimer === '00:00:00') return false;

    const [hours, minutes, seconds] = this.tokenTimer.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const minRequiredSeconds = 15 * 60; // '00:10:00' in seconds
    return totalSeconds < minRequiredSeconds;
  }

}
