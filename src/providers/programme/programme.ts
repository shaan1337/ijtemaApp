import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

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
  programmes = [];

  constructor(public http: Http, public apiProvider: ApiProvider, public storage: Storage) {
  }

  public getProgrammes(loadFromWeb, callback){
    return this.storage.get('programme')
    .then((val)=>{
      if(loadFromWeb){
        this.http.get(this.apiProvider.getAPIURL() + '/programme').map(res => res.json()).subscribe(data => {
          this.storage.set('programme',JSON.stringify(data));
          callback();
        });
      }

      if(!val) this.programmes = [];
      else this.programmes = JSON.parse(val);

      this.setIds();

      return this.programmes;
    });
  }

  private setIds(){
    for(var i=0;i<this.programmes.length;i++){
      this.programmes[i]['id'] = i;
    }
  }

  public getCompetitions(){
    var result = [];
    var dayItem = null;
    for(var i=0;i<this.programmes.length;i++){
      if(this.programmes[i].type=='day'){
        dayItem = this.programmes[i];
      } else if(this.programmes[i].type == 'competition'){
        if(dayItem != null){
          result.push(dayItem);
          dayItem = null;
        }
        result.push(this.programmes[i]);
      }
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
    return this.getNext(this.programmes);
  }

  public getNextCompetitionId(){
    return this.getNext(this.getCompetitions());
  }

  private getNext(programmes: any[]){
    if(programmes.length==0) return -1;

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
