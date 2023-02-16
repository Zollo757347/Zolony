import Image from '../components/Image';
import Table from '../components/Table';

import tableData from "../assets/json/tables/signal.json";

const Signal = () => {
  return (
    <article>
      <h1>一切的開端．訊號</h1><hr/>

      <section>
        <p>訊號是所有紅石機關能夠運作的根本原因，透過操作電路內的訊號分布，就可以幫我們達成各式各樣的目標。這小節會先介紹訊號的來源——<b>電源</b>，再介紹電源是如何透過<b>強充能</b>的機制產生訊號的。</p>
      </section>

      <section>
        <h2>電源</h2>
        <p><b>電源</b>（Power Source）是一種可以產生紅石訊號的方塊，大部分的電源都需要滿足特定條件才能產生紅石訊號。根據不同的使用情況，會選擇不同的電源來提供紅石訊號，一般而言，最常見的電源是控制桿（提供穩定的「開／關」訊號）與按鈕（提供短暫的「關→開→關」訊號）。我們先以控制桿來當作電源舉例：</p>
        <Image src={require("../assets/pictures/signal/lever.png")} alt="控制桿的開與關" width="50%"/>
        <p>上圖中控制桿的狀態是左關右開的，你可以很明顯地看出，因為右邊控制桿被拉下，它附著的紅石燈就被點亮了。</p>
        <div className="rs-prop"><b>電源</b>：可以產生紅石訊號的特殊方塊</div>
        <p>但為什麼控制桿被拉下，紅石燈就會點亮呢？這時候就要提到「強充能」的概念了。</p>
      </section>

      <section>
        <h2>充能</h2>
        <p><b>充能</b>（Powering）可以直接從字面上理解意思——「填充能量」，雖然它的意思簡單，但這卻是紅石電路中最重要的機制。當一個電源的啟動條件達成後，最多會有兩個方塊被強充能，一個是電源本身（偵測器除外），另一個是電源指向的方塊（必須是可充能方塊）。就上面控制桿的例子來說，控制桿的啟動條件是被玩家拉下，在這時候控制桿本身會被強充能，而它指向的實體方塊（控制桿指向的方塊就是它的附著方塊）也會被強充能。</p>
        <p>但就算一個方塊被充能，我們也很難看出差別，最簡單的方法就是用紅石燈來觀察一個方塊是否被充能。當一個紅石燈的任何一個相鄰方塊被充能，或是紅石燈本身被充能時，紅石燈就會點亮，而這邊的「相鄰方塊」指的是紅石燈的上下左右前後共六個方塊。</p>
        <Image src={require("../assets/pictures/signal/power.png")} alt="控制桿的充能" width="50%"/>
        <p>上圖中，藍色紅石燈因為與控制桿相鄰而被點亮，黃色紅石燈因為直接被控制桿充能而點亮，綠色紅石燈因為與黃色紅石燈（充能方塊）相鄰而被點亮，而紅色紅石燈沒有與任何充能方塊相鄰，也沒有被充能，因此還是暗的。</p>
      </section>

      <section>
        <h2>電源列表</h2>
        <p>大多數電源就只是提供訊號來源而已，只有少部分電源如紅石方塊、紅石火把才會有額外的特殊功能，因此每個電源的屬性（指向方塊、充能強度等）只需要看過一眼，有個大概的印象就可以了，並不是電路設計的重點。在接下來的教學中，除非遇到特殊情況，否則我們都會以控制桿來做為電源。這邊就直接粗略把所有電源分成三類，以列表的形式呈現給你參考。</p>
      </section>

      <section>
        <h3>永久電源</h3>
        <p>永久電源是無論如何都會啟動的電源。</p>
        <Table content={tableData.permanent} />
      </section>

      <section>
        <h3>條件電源</h3>
        <p>條件電源只有在滿足特定條件下才會啟動，其他時間都會處於未啟動的狀態。</p>
        <Table content={tableData.conditional} />
      </section>

      <section>
        <h3>脈衝電源</h3>
        <p>脈衝電源只有滿足特定條件時才會啟動，且啟動後只會發出一道短暫的紅石訊號，隨即消失，這種短暫的「關→開→關」訊號就稱為「<b>正脈衝</b>（On-pulse）」。</p>
        <div className="note">如果訊號是短暫的「開→關→開」，則此訊號稱為「<b>負脈衝</b>（Off-pulse）」。</div>
        <Table content={tableData.pulse} />
      </section>
    </article>
  );
}

export default Signal;