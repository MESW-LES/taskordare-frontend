import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { GroupService } from '../services/group.service';
import { AdminService } from '../services/admin.service';
import { Router, NavigationEnd } from '@angular/router';
import { GroupDetail } from '../classes/group-detail';
import { UsergroupDetail } from '../classes/usergroup-detail';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})



export class UserGroupsComponent implements OnInit {
  faTrash = faTrash;
  faPlus = faPlus;

  divName = "nothing";

  htmlToAdd:any;
  
  private groupDetail = new GroupDetail();
  private usergroupDetail = new UsergroupDetail();

  constructor(
    private adminService: AdminService,
    private groupService: GroupService,
    private router: Router,
    private sanitized: DomSanitizer
    ) {
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) { 
          /* Your code goes here on every router change */
          if(ev.url == "/usergroups"){
            console.log("onInit  User-groups - start");
            let result:any;


            //todo: change to getUseGroup according to token
            this.groupService.getAllGroups().subscribe(
              (response) => {
                result = response;
                //console.log(result.data.Users);
                if (result.status == "OK") {
                  this.htmlToAdd = result.data.Users;  
                }
                if (result == -1) {
                  alert(
                    'error'
                  );
                }
              },
              (error) => {
                console.log('Errors (CORS?) - ' + JSON.stringify(error));
              }
            );

            console.log("onInit  User-groups - end");
          }
        }
      });
    }

  ngOnInit() {
    if (this.adminService.isLoggedIn()) {
      // this.router.navigate(['/usermain']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  addDare(value:any){

  }

  showJoinGroup(){
    this.divName = "joinGroup"
  }
  showCreateGroup(){
    this.divName = "createGroup"
  }
  showGroupAndTasks(groupName:any){
    //todo: get group members and goals
    console.log(groupName)
    this.divName = "membersTaks"
  }

  createGroup(result:any){
    // console.log("haahahh: " + value.name.value)
    // var UserDetail = {
    //   firstName, 
    //   firstName2: , 
    // };

    this.groupDetail.groupName = result.name.value;
    this.groupDetail.description = result.description.value;

  
    this.groupService.createGroup(this.groupDetail).subscribe(
      (response) => {
        let result =  response;
        console.log(result)
        if (result.status == "CREATED") {
          console.log("Group Created")
          alert("Group Created")
          
        }
        if (result == -1) {
          alert(
            'please register before login Or Invalid combination of Email and password'
          );
        }
      },
      (error) => {
        console.log('Errors (CORS?) - ' + JSON.stringify(error));
      }
    );
  }

  joinGroup(result: any){
    console.log(result.groupname.value);

    this.groupService.getGroupInfo(result.groupname.value).subscribe(
      (response) => {
        let result =  response;
        console.log(result.data.Group.id);
        console.log(result.status);

        if(result.status == "OK"){
          this.usergroupDetail.groupId = result.data.Group.id;
          this.usergroupDetail.userId = Number(localStorage.getItem('id'));
          this.usergroupDetail.points = 0;
          this.usergroupDetail.permission = 0;

          console.log(this.usergroupDetail)
          this.groupService.joinGroup(this.usergroupDetail).subscribe(
            (response) => {
              let result =  response;
              console.log(result)

              if (result.status == "OK") {
                console.log("Group Joined")
                alert("Group Joined")
              }
              if (result == -1) {
                alert(
                  'error in joining'
                );
              }
            },
            (error) => {
              console.log('Errors (CORS?) - ' + JSON.stringify(error));
            }
          );
        }
        if (result == -1) {
          alert(
            'error in finding group id'
          );
        }
      },
      (error) => {
        console.log('Errors (CORS?) - ' + JSON.stringify(error));
      }
    );

  }

  transform(value :any) {
    console.log(value)
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

}