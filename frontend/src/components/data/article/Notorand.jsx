import { Image } from 'antd';

const Notorand = () => {
  return (
    <article>
      <h1>邏輯閘．非或與</h1><hr/>

      <section>
        <h2>邏輯閘</h2>
        <p><b>邏輯閘</b>（Logic Gate）是一個邏輯電路的基本單位，通常一個邏輯閘會有多個輸入端與一個輸出端，每個輸入端與輸出端都代表著一個布林變數，也就是有或無、真或假、1 或 0。</p>

        <p>每種邏輯閘都有代表自己的「規則」，而邏輯閘的工作就是接收輸入端給出的一組布林變數，判斷這組布林變數是否符合自己的「規則」，如果符合的話就輸出 1，否則輸出 0。本文將會介紹最基本的四個邏輯閘：NOT、OR、AND、XOR。</p>
      </section>

      <section>
        <h2>NOT Gate</h2>
        <p><b>非閘</b>（NOT Gate）是個只有一個輸入端、一個輸出端的邏輯閘，這個邏輯閘的規則是「輸入是否等於 0」，NOT Gate 的真值表會是：</p>

        <table className="property-list">
          <thead>
            <tr>
              <th>輸入</th>
              <th>輸出</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

        <div className="rs-prop"><b>真值表</b>：一種把所有輸入的可能、以及每組輸入組合所對應的輸出全部列出來的表。</div>

        <p>從結果上來看，會發現 NOT Gate 在做的事情就是把 0 變成 1、1 變成 0，輸出都是輸入的否定狀態，這也是 NOT Gate 之所以被稱為 NOT Gate 的原因。</p>

        <p>在紅石電路中，因為紅石火把有「訊號反轉」的特性，所以要製作出一個 NOT Gate 只需要一個可充能方塊與一個紅石火把就可以了：</p>
        <Image src={require("../img/notorand/not-gate.png")} alt="紅石電路中的 NOT Gate" width="50%"/>

      </section>

      <section>
        <h2>OR Gate</h2>
        <p><b>或閘</b>（OR Gate）是個有兩個輸入端、一個輸出端的邏輯閘，這個邏輯閘的規則是「輸入 A 或輸入 B 其中一個是 1」，OR Gate 的真值表會是：</p>

        <table className="property-list">
          <thead>
            <tr>
              <th>輸入 A</th>
              <th>輸入 B</th>
              <th>輸出</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>

        <p>其實 OR Gate 的規則可以換句話說：「輸入 A <b>或</b>輸入 B 其中一個是 1」，從這個角度來看，就可以很明顯地看出為什麼 OR Gate 被叫做 OR Gate 了。</p>

        <p>在紅石電路中，要製作出 OR Gate 並不需要紅石粉以外的方塊，只需要把兩個輸入端用紅石粉連起來就可以了：</p>
        <Image src={require("../img/notorand/or-gate.png")} alt="紅石電路中的 OR Gate" width="50%"/>

      </section>

      <section>
        <h2>AND Gate</h2>
        <p><b>與閘</b>（AND Gate）是個有兩個輸入端、一個輸出端的邏輯閘，這個邏輯閘的規則是「兩個輸入端是否都是 1」，AND Gate 的真值表會是：</p>

        <table className="property-list">
          <thead>
            <tr>
              <th>輸入 A</th>
              <th>輸入 B</th>
              <th>輸出</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>0</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>

        <p>就跟 OR Gate 差不多，AND Gate 的規則也可以換句話說：「輸入 A <b>與</b>輸入 B 都是 1」，如此一來 AND Gate 的命名來源也是顯而易見的。</p>

        <p>在紅石電路中，要製作出 AND Gate 相對 NOT、OR Gate 而言比較複雜，會需要三個可充能方塊與三個紅石火把，並排列成下面的形式：</p>
        <Image src={require("../img/notorand/and-gate.png")} alt="紅石電路中的 AND Gate" width="50%"/>
      </section>

      <section>
        <h2>XOR Gate</h2>
        <p><b>異或閘</b>（XOR Gate）是個有兩個輸入端、一個輸出端的邏輯閘，這個邏輯閘的規則是「兩個輸入端是否不相等」，XOR Gate 的真值表會是：</p>

        <table className="property-list">
          <thead>
            <tr>
              <th>輸入 A</th>
              <th>輸入 B</th>
              <th>輸出</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

        <p>乍看之下，XOR Gate 似乎沒什麼特別的規律，但如果把 XOR Gate 看成是二進位的加法，輸入 A 與輸入 B 分別當成加數與被加數，輸出就可以當成和的個位數。事實上，在我們稍後將介紹的加法器中，正是利用了 XOR Gate 製作出來的。</p>

        <p>因為 XOR Gate 並不是最基本的邏輯閘，所以在紅石電路中製作 XOR Gate 會相對比較複雜，因此根據不同的需求（如最小、最快、最易得等等）也有許多不同的方法，這邊就舉其中一個實作的方法，這種方法會需要用到 5 個紅石火把、2 個紅石中繼器：</p>
        <Image src={require("../img/notorand/xor-gate.png")} alt="紅石電路中的 XOR Gate" width="50%"/>

      </section>
    </article>
  );
}

export default Notorand;