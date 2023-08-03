import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, HelperService, DataService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  status: any = {
    subscription: {
      active: false
    },
    questionnaire: {
      filled: false
    }
  };

  picture: any = [
    {
      class: "masspro",
      goal: "Goal: muscle mass",
      category: "mass pro",
    },
    {
      class: "bootybuilder",
      goal: "Goal: Fat loss",
      category: "booty bulider",
    },
    {
      class: "hiitxhome",
      goal: "Goal: fat loss",
      category: "hIIT-X Home",
    },
    {
      class: "summer",
      goal: "Goal: FAT LOSS",
      category: "summer shred",
    },
    {
      class: "bodyweight",
      goal: "Goal: muscle gain",
      category: "bodyweight Pro",
    },
    {
      class: "toned",
      goal: "Goal: Fat loss",
      category: "summer toned",
    }
  ]
  works: any = [
    {
      heading: "01",
      cardTitle: "find your coach",
      cardText: "Answer a few questions, then select a coach based on their experience, training style and personality. You can change your coach any time.",
    },
    {
      heading: "02",
      cardTitle: "get on a call",
      cardText: "Hop on a FaceTime call to get to know your coach, share your goals and develop a training plan together. Throughout your journey, you’ll continue calibrating.",
    },
    {
      heading: "03",
      cardTitle: "start shaping",
      cardText: "Access your workouts in our iOS app and keep up the activities you already love doing. Your coach will check in daily to keep you on track and tune your routine.",
    }
  ]
  responsiveOptions: any = [];

  constructor(
    private httpService: HttpService,
    private helperService: HelperService,
    public dataService: DataService,
    private router: Router,
    private toastr: ToastrService,
    // private videoplayer: VideoConfiguration
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    const client = this.helperService.getClient();
    if (client) {
      this.getClientStatus();
    }
    this.picture = this.picture
    this.works = this.works
  }

  getClientStatus(): void {
    this.httpService.call(api.clientStatus)
      .then(success => {

        this.status = success;
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  start(): void {
    const client = this.helperService.getClient();

    if (client) {

      if (client && client.questionnaire.filled === false) {
        this.router.navigate(['questionnaire']);
      } else if (client && client.questionnaire.filled && client.order.active === null) {
        this.router.navigate(['checkout']);
      } else if (client && client.order.active && client.questionnaire.filled && client.onboarding.callBooked === false) {
        this.router.navigate(['book-a-call']);
      }

    } else {
      this.dataService.sendData(this.dataService
        .typeDialog('auth-dialog'));
    }
  }

  isPlay: boolean = false;
  toggleVideo(event: any) {
    var myVideo: any = document.getElementById('my_video_1');
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }
  playPause() {
    var myVideo: any = document.getElementById('my_video_1');
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }

}
