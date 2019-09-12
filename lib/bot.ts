import { TurnContext } from "botbuilder";
import { QnAMaker } from "botbuilder-ai";

export class ConfBot {
    
    private _qnaMaker: QnAMaker;

    constructor(qnaMaker: QnAMaker) {
        this._qnaMaker = qnaMaker;
    }

    async onTurn(context: TurnContext) {
        if (context.activity.type === "message") {
            if(context.activity.text === "Empezar"){
                var userName = context.activity.from.name;
                await context.sendActivity(`¡Hola ${userName}! ☺ ¿Cuál es tu consulta?`);
            }else{
                const qnaResults = await this._qnaMaker.generateAnswer(context.activity.text);
                console.log(qnaResults);
                if (qnaResults.length > 0) {
                    await context.sendActivity(qnaResults[0].answer)
                } else {
                    var ranInt =  Math.floor(Math.random() * ((3+1)-1)+1);
                    switch(ranInt) {
                        case 1:
                            await context.sendActivity(`¿En qué te puedo ayudar?`);
                          break;
                        case 2:
                            await context.sendActivity(`¿Disculpa?`);
                          break;
                        default:
                            await context.sendActivity(`Disculpame, tengo problemas con comprender lo que me quieres decir.`);
                      }
                    /**await this._luis.recognize(context).then(res => {
                        const top = LuisRecognizer.topIntent(res);
                        context.sendActivity(`the top intent found was ${top}`);
                    });**/
                }
                //await context.sendActivity(`You said ${context.activity.text}`);
            }
        }else{
            //await context.sendActivity(`${context.activity.type} event detected`);
        }
    }
}