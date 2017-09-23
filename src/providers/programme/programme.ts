import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProgrammeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProgrammeProvider {
  //each item must have at least a 'date' or 'time'. Last item in a day must have an 'endTime'.
  //if an item does not have an 'endTime', the next item below it should have a 'time'
  //'date' format: 'yyyy-mm-dd'
  //'time' format: 'hh:mm'
  programmes = [ 
    { type: 'day', date: '2017-09-23', title:'Friday 28th October'},
    { type: 'program', time: '10:00', title: 'Jummah Prayer with Asr' },
    { type: 'program', time: '13:45', title: 'Hoisting of Flag & Du\'a' },
    { type: 'competition', time: '14:00', title: 'Fun Games', competitions: ['Domino (Preliminary Round)', 'Carrom', 'Dart', 'Foot for Fun']},
    { type: 'program', time: '15:00', title: 'Tea' },
    { type: 'program', time: '17:30', title: 'Dinner' },
    { type: 'program', time: '18:30', title: 'Maghrib & Isha Prayers' },
    { type: 'program', time: '18:50', title: 'Tilawat Qur\'an' },
    { type: 'program', time: '19:00', title: 'Ahad' },
    { type: 'program', time: '19:00', endTime: '21:00', title: 'Refreshments' },
    { type: 'competition', time: '19:05', title: 'Competitions',competitions: ['Nazam','Speech','Foot-A-3','IronMan','PlayStation']},    
    { type: 'day', date: '2017-09-24', title:'Saturday 29th October'},    
    { type: 'competition', time: '19:00', title: 'Competitions - Open to All' },
    { type: 'program', time: '19:00', title: 'Ahad' },
    { type: 'program',  time: '19:00', endTime: '21:00', title: 'Refreshments' }    
  ];

  constructor(public http: Http) {
    this.setIds();
  }

  private setIds(){
    for(var i=0;i<this.programmes.length;i++){
      this.programmes[i]['id'] = i;
    }
  }

  public getProgrammes(){
    return this.programmes;
  }

  public getCompetitions(){
    var result = [];
    for(var i=0;i<this.programmes.length;i++){
      if(this.programmes[i].type=='day' || this.programmes[i].type == 'competition') result.push(this.programmes[i]);
    }

    return result;
  }

  private parseDate(dateString){
    try{
      return Date.parse(dateString+"T00:00");
    }
    catch(err){
      return undefined;
    }
  }

  private parseTime(timeString){
    try{
      return parseInt(timeString.substring(0,2)) * 60 * 60 * 1000 + parseInt(timeString.substring(3)) * 60 * 1000;
    }
    catch(err){
      return undefined;
    }
  }

  public getNextProgrammeId(){
    return this.getNext(this.getProgrammes());
  }

  public getNextCompetitionId(){
    return this.getNext(this.getCompetitions());
  }

  private getNext(programmes: any[]){
    var now = Date.parse((new Date()).toISOString());
    var date;
    var nextProgramme = -1;

    for(var i=0;i<programmes.length;i++){
      try{
        var p = programmes[i];

        var startTime, endTime;

        if(p['date']!==undefined){
          date = this.parseDate(p['date']);
          startTime = this.parseTime('00:00');
        }

        if(p['time']!==undefined)
          startTime = this.parseTime(p['time']);

        if(p['endTime']!==undefined)
          endTime = this.parseTime(p['endTime']);
        else if(i+1 < programmes.length)
          endTime = this.parseTime(programmes[i+1]['time']);

        if(date==undefined || startTime==undefined || endTime==undefined)
          throw "Invalid program item: "+JSON.stringify(p)+" at position: "+i+" date: "+date+" startTime: "+startTime+" endTime: "+endTime;
        
        var start = date + startTime;
        var end = date + endTime;
        
        if(now < start || (start<=now && now<end)){
          nextProgramme = i;
          break;
        }
      }
      catch(err){
        console.log(err);
        break;
      }
    }

    if(nextProgramme==-1) nextProgramme = 0; //all programmes completed
    
    return programmes[nextProgramme].id;
  }


}
