import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, HelperService, DataService } from 'app/services';
import * as $ from 'jquery'
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-studio-landing',
  templateUrl: './studio-landing.component.html',
  styleUrls: ['./studio-landing.component.scss']
})
export class StudioLandingComponent implements OnInit {
  responsiveOptions: any = [];
  // worldCards: any = [];
  // items: Array<MenuItem>;

  constructor(private httpService: HttpService,
    private helperService: HelperService,
    public dataService: DataService,
    private router: Router) {
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
  picture: any = [
    {
      class: "slider-1",
      category: "EzToned Masterclasses",
    },
    {
      class: "slider-2",
      category: "New EzToned Equipment",
    },
    {
      class: "slider-3",
      category: "More EzToned Guided Workouts",
    },
    {
      class: "slider-4",
      category: "EzToned Now Workouts",
    },
    {
      class: "slider-5",
      category: "EzToned Masterclasses",
    },
    {
      class: "slider-6",
      category: "New EzToned Equipment",
    },
    {
      class: "slider-7",
      category: "summer toned",
    }

  ]
  worldCards: any = [
    {
      name: "Fringilla Fusce Elit",
      subName: "Floyd Miles"
    },
    {
      name: "Ullamcorper",
      subName: "Esther Howard"
    },
    {
      name: "Malesuada Ferment…",
      subName: "Cody Fisher"

    },
    {
      name: "Parturient Lorem",
      subName: "Eleanor Pena"

    },
    {
      name: "Tortor Nullam Fringi…",
      subName: "Marvin McKinney"

    },

    {
      name: "Fringilla Fusce Elit",
      subName: "Esther Howard"

    },
    {
      name: "Ullamcorper",
      subName: "Marvin McKinney"
    },
    {
      name: "Marvin McKinney",
      subName: "Eleanor Pena"
    },

  ]
  classes: any = [
    {
      imgClass: "classes-img-1",
      classImgText: "BOLT"
    },
    {
      imgClass: "classes-img-2",
      classImgText: "guided"
    },
    {
      imgClass: "classes-img-3",
      classImgText: "essential"
    },
  ]
  ngOnInit(): void {
    this.picture = this.picture

    $(document).ready(function () {

      function detect_active() {
        // get active
        var get_active = $("#dp-slider .dp_item:first-child").data("class");
        $("#dp-dots li").removeClass("active");
        $("#dp-dots li[data-class=" + get_active + "]").addClass("active");
      }
      $("#dp-next").click(function () {
        var total = $(".dp_item").length;
        $("#dp-slider .dp_item:first-child").hide().appendTo("#dp-slider").fadeIn();
        $.each($('.dp_item'), function (index, dp_item) {
          $(dp_item).attr('data-position', index + 1);
        });
        detect_active();

      });

      $("#dp-prev").click(function () {
        var total = $(".dp_item").length;
        $("#dp-slider .dp_item:last-child").hide().prependTo("#dp-slider").fadeIn();
        $.each($('.dp_item'), function (index, dp_item) {
          $(dp_item).attr('data-position', index + 1);
        });

        detect_active();
      });

      $("#dp-dots li").click(function () {
        $("#dp-dots li").removeClass("active");
        $(this).addClass("active");
        var get_slide = $(this).attr('data-class');
        console.log(get_slide);
        $("#dp-slider .dp_item[data-class=" + get_slide + "]").hide().prependTo("#dp-slider").fadeIn();
        $.each($('.dp_item'), function (index, dp_item) {
          $(dp_item).attr('data-position', index + 1);
        });
      });


      $("body").on("click", "#dp-slider .dp_item:not(:first-child)", function () {
        var get_slide = $(this).attr('data-class');
        console.log(get_slide);
        $("#dp-slider .dp_item[data-class=" + get_slide + "]").hide().prependTo("#dp-slider").fadeIn();
        $.each($('.dp_item'), function (index, dp_item) {
          $(dp_item).attr('data-position', index + 1);
        });

        detect_active();
      });
    });
  }
  isPlay: boolean = false;
  coach_Image_next: boolean = false;

  coachImage() {
    if (this.coach_Image_next == false) {
      this.coach_Image_next = true;
    } else {
      this.coach_Image_next = false;

    }
  }

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

  scrollStudio(): void {
    // @ts-ignore:
    document.getElementById("packages").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  joinStudio(pkg = 0): void {

    const client = this.helperService.getClient();

    if (client) {

    } else {
      this.dataService.sendData(this.dataService
        .typeDialog('auth-dialog', pkg));
    }

  }
}
